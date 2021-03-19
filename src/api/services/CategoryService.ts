import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Category } from '../models/Category';
import { ObjectID } from 'mongodb';

@Service()
export class CategoryService {

    constructor(@OrmRepository() private categoryRepository: CategoryRepository, @Logger(__filename) private log: LoggerInterface) { }

    public find(findCondition: any): Promise<any[]> {
        this.log.info('Find Condition Category');
        return this.categoryRepository.find(findCondition);
    }
    
    public findAll(): Promise<any> {
        this.log.info('Find All Category');
        return this.categoryRepository.find();
    }

    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find Condition Category');
        return this.categoryRepository.findOne(findCondition);
    }

    public async create(category: Category): Promise<Category> {
        this.log.info('Create Category');
        return await this.categoryRepository.save(category);
    }

    public async deleteOne(query: any, options?: any): Promise<any> {
        this.log.info('Delete Category');
        return await this.categoryRepository.deleteOne(query, options);
    }

    public updateOne(query: any, newValue: any): Promise<any> {
        this.log.info('Update Category');
        return this.categoryRepository.updateOne(query, newValue);
    }

    public aggregate(query: any, options?: any): Promise<any[]> {
        this.log.info('Find All User');
        return this.categoryRepository.aggregate(query, options).toArray();
    }

    public cleanCategoryField(category: any): any {
        if (category !== undefined && category !== null) {
            if (category !== undefined && category !== null) {
                const clearItem = {
                    id: category.id,
                    name: category.name
                };
                category = clearItem;
            }
        }
        return category;
    }

    public async getChild(parentId: any): Promise<any[]> {
        this.log.info('Find Child Category');
        const childObj = await this.find({ where : { parent_category: new ObjectID(parentId) }});
        const child:any[] = new Array();
        for (let i = 0; i < childObj.length; i++) {
            const childArray = await this.getChild(childObj[i].id);
            const element = {
                id: childObj[i].id,
                name: childObj[i].name,
                parent_category: childArray
            };
            child.push(element);
        }
        return child;
    }

    public async getNotChild(parentId: any): Promise<any[]> {
        this.log.info('Find Child Category');
        const childObj = await this.find({ parent_category: new ObjectID(parentId) });
        const child:any[] = new Array();
        for (let i = 0; i < childObj.length; i++) {
            const childArray = await this.getNotChild(childObj[i].id);
            child.push(childObj[i].id);
            if (childArray.length > 0) {
                for (const item of childArray) {
                    child.push(item);
                }
            }
        }
        return child;
    }

    public formatCategory(category: any): any {

        this.log.info('Format Category Join Category');
        if (category !== undefined) {
            const formattedCategory: any[] = new Array();
            for (const item of category) {

                const formatItem = {
                    id: item._id,
                    name: item.name,
                    parent_category: item.parent_category,
                    description: item.description,
                    pin: item.pin,
                    pin_ordering: item.pin_ordering
                };

                formattedCategory.push(formatItem);
            }
            
            return formattedCategory;
        }else{
            return category;
        }
    }

    public formatCategoryJoin(category: any): any {
        this.log.info('Format Category Join Category');
        if (category !== undefined) {
            const formattedCategory: any[] = new Array();
            for (const item of category) {
                if (item.category.length === 0) {
                    item.category.push({ name : ''});
                }
                const formatItem = {
                    id: item._id,
                    name: item.name,
                    parent_category: item.parent_category,
                    parent_category_name: item.category[0].name,
                    description: item.description,
                    pin: item.pin,
                    pin_ordering: item.pin_ordering
                };

                formattedCategory.push(formatItem);
            }
            
            return formattedCategory;
        }else{
            return category;
        }
    }

    public formatNotChild(category: any[]): any {
        this.log.info('Format Category NotChild Category');
        if (category.length > 0) {
            const formattedCategory: any[] = new Array();
            for (const item of category) {
                const formatItem = {
                    id: item.id,
                    name: item.name,
                };

                formattedCategory.push(formatItem);
            }
            
            return formattedCategory;
        }else{
            return category;
        }
    }

}