import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Contact } from '../models/Contact';
import { ContactRepository } from '../repositories/ContactRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class ContactService {

    constructor(@OrmRepository() private contactRepository: ContactRepository, @Logger(__filename) private log: LoggerInterface) { }

    // find contact
    public find(findCondition: any): Promise<any[]> {
        this.log.info('Find All Contact');
        return this.contactRepository.find(findCondition);
    }

    // find contact
    public findAll(): Promise<any> {
        this.log.info('FindAll Contact');
        return this.contactRepository.find();
    }

    // find contact
    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find Contact');
        return this.contactRepository.findOne(findCondition);
    }

    // create contact
    public async create(contact: Contact): Promise<Contact> {
        this.log.info('Create Contact');
        return await this.contactRepository.save(contact);
    }

    // update contact
    public update(query: any, newValue: any): Promise<any> {
        this.log.info('Update Contact');
        return this.contactRepository.updateOne(query, newValue);
    }

    // delete contact
    public async delete(query: any, options?: any): Promise<any> {
        this.log.info('Delete Contact');
        return await this.contactRepository.deleteOne(query, options);
    }

    public async deleteOne(query: any, options?: any): Promise<any> {
        this.log.info('Delete Contact');
        return await this.contactRepository.deleteOne(query, options);
    }

    public formatContact(contact: any): any {
        this.log.info('Format Contact Join Contact');
        if (contact !== undefined) {
            const formattedContact: any[] = new Array();
            for (const item of contact) {
                const formatItem = {
                    id: item.id,
                    lable: item.lable,
                    icon: '/image/contact/' + item.id,
                    value: item.value,
                    url: item.url
                };
                formattedContact.push(formatItem);
            }
            
            return formattedContact;
        }else{
            return contact;
        }
    }
}
