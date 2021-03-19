import 'reflect-metadata';
import { JsonController, Res, Req, Get, Post, Body, QueryParam, Delete, Put, Param } from 'routing-controllers';
import { Category } from '../models/Category';
import { CategoryService } from '../services/CategoryService';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { CreateCategoryRequest } from './requests/CreateCategoryRequest';
import { UpdateCategoryRequest } from './requests/UpdateCategoryRequest';
import { LogService } from '../services/LogService';
import { Log } from '../models/Log';
import { ArticleService } from '../services/ArticleService';
import { ObjectID } from 'mongodb';
import { UserService } from '../services/UserService';

@JsonController('/category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logService: LogService,
        private articleService: ArticleService,
        private userService: UserService) {
    }

    @Get()
    public async findCategory(@QueryParam('mode') mode: string,@QueryParam('category_id') category_id: string,@QueryParam('parent_category_id') parent_category_id: string,@Req() request: any, @Res() response: any): Promise<any> {
        console.log(mode);
        if (mode !== undefined) {
            if (mode === 'pin') {
                const pinCategory = await this.categoryService.aggregate([
                    { 
                        $match: 
                            {
                                pin: true,
                            }
                    },
                    {
                        $sort: 
                            {
                                pin_ordering : 1
                            }
                    }
                ]);
                const result = await this.categoryService.formatCategory(pinCategory);
                return response.status(200).send(result);
            } else if (mode === 'child') {
                const parentCategory = await this.categoryService.find({ where: { parent_category: ''}});
                const category: any[] = new Array();
                for (let i = 0; i < parentCategory.length; i++) {
                    const parentArray = await this.categoryService.getChild(parentCategory[i].id);
                    const eliment = {
                        id: parentCategory[i].id,
                        name: parentCategory[i].name,
                        parent_category: parentArray
                    };
                    category.push(eliment);
                }

                return response.status(200).send(category);
            } else if (mode === 'notChild') {

                if (category_id !== undefined) {

                    const child = await this.categoryService.getNotChild(category_id);
                    child.push(new ObjectID(category_id));
                    const category = await this.categoryService.find({ _id: { $nin: child } });
                    const result = await this.categoryService.formatNotChild(category);
                    return response.status(200).send(result);

                }

                return response.status(400).send('category_id is require');

            } else {

                return response.status(400).send('not mode : '+ mode);

            }
        }else{
            const allCategory = await this.categoryService.aggregate(
                [
                    {
                        $lookup:
                            {
                                from: 'category',
                                localField: 'parent_category',
                                foreignField: '_id',
                                as: 'category'
                            }
                    }
                ]
            );
            const result = await this.categoryService.formatCategoryJoin(allCategory);
            return response.status(200).send(result);
        }
    }

    @Post()
    public async createCategory(@Body({ validate: true }) body: CreateCategoryRequest, @Res() response: any, @Req() req: any): Promise<any> {
        const dataName: Category = await this.categoryService.findOne({ where: { name: body.name } });
        if (dataName) {
            const errorResponse = ResponseUtil.getErrorResponse('This CategoryName already exists', dataName);
            return response.status(400).send(errorResponse);
        }
        
        const category: Category = new Category();
        category.name = body.name;
        if (body.parent_category !== undefined && body.parent_category !== null && body.parent_category !== '') {
            category.parent_category = new ObjectID(body.parent_category);
        } else {
            category.parent_category = '';
        }
        category.description = body.description;
        category.pin = false;
        category.pin_ordering = 0;

        const result = await this.categoryService.create(category);

        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});

            const log: Log = new Log();
            log.action = 'create';
            log.collection = 'category';
            log.document = result.id;
            log.description = owner.firstname + ' สร้างหมวด ' + result.name;
            log.user_id = new ObjectID(body.user_id);
            
            await this.logService.create(log);
            const successResponse = ResponseUtil.getSuccessResponse('Create Category Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Create Category Failed', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    @Put('/:categoryId')
    public async updateCategory(@Param('categoryId') categoryId: string,@Body({ validate: true }) body: UpdateCategoryRequest,@Req() request: any, @Res() response: any): Promise<any> { 
        const checkName = await this.categoryService.findOne({name: body.name});
        console.log('dasddad',checkName);
        
        if (checkName) {
            if (checkName.id.toString() !== categoryId) {
                const errorResponse = ResponseUtil.getErrorResponse('This category name is already', checkName);
                return response.status(400).send(errorResponse);
            }
        }
        
        const category = await this.categoryService.findOne({_id : new ObjectID(categoryId)});

        let pin = false;
        const pin_ordering = body.pin_ordering;
        if (pin_ordering !== 0) {
            pin = true;
        }

        let parent_category: any;
        if (body.parent_category !== undefined && body.parent_category !== null && body.parent_category !== '') {
            parent_category = new ObjectID(body.parent_category);
        } else {
            parent_category = '';
        }

        const result = await this.categoryService.updateOne(
            { '_id' : new ObjectID(categoryId) },
            { $set: {   'name' : body.name,
                        'parent_category': parent_category,
                        'description': body.description,
                        'pin': pin,
                        'pin_ordering': pin_ordering } });
        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
            const log: Log = new Log();
            log.action = 'update';
            log.collection = 'category';
            log.document = new ObjectID(categoryId);
            log.description = owner.firstname + ' ได้แก้ไขหมวดหมู่ ' + category.name;
            log.user_id = new ObjectID(body.user_id);
            await this.logService.create(log);

            const successResponse = ResponseUtil.getSuccessResponse('update Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('update Failed', result);
            return response.status(400).send(errorResponse);
        }
        
    }

    @Delete('/:categoryId')
    public async deleteCategory(@Param('categoryId') categoryId: string,@QueryParam('user_id') user_id: string,@Req() request: any, @Res() response: any): Promise<any> {
        if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
            if (user_id === undefined || user_id == null || user_id === '') {
                const errorResponse = ResponseUtil.getErrorResponse('user_id Failed', undefined);
                return response.status(400).send(errorResponse);
            }
            const category = await this.categoryService.findOne({_id : new ObjectID(categoryId)});
            const result = await this.categoryService.deleteOne({_id : new ObjectID(categoryId)});
            if (result) {
                await this.articleService.updateMany(
                    { 'category_id': new ObjectID(categoryId) },
                    { $set: {   
                                'is_deleted': true
                            }
                    }
                );
                const owner = await this.userService.findOne({_id : new ObjectID(user_id)});
                const log: Log = new Log();
                log.action = 'delete';
                log.collection = 'category';
                log.document = new ObjectID(category.id);
                log.description = owner.firstname + ' ได้ลบหมวดหมู่ ' + category.name + ' และบทความที่อยู่ในหมวดหมู่นี้ก็ถูกลบไปทั้งหมด';
                log.user_id = new ObjectID(user_id);
                await this.logService.create(log);

                const successResponse = ResponseUtil.getSuccessResponse('Delete Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Delete Failed', result);
                return response.status(400).send(errorResponse);
            }
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('CategoryId Failed', undefined);
            return response.status(400).send(errorResponse);
        }

    }

    @Get('/test/test')
    public async findCategory2(@Req() request: any, @Res() response: any): Promise<any> {

        const allChild = await this.categoryService.getNotChild('60335ea1ca4bc5a5bccb2931');        
        // allChild.length;
        return response.status(200).send(allChild);

    }

}