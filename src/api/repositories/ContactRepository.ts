import { EntityRepository, MongoRepository } from 'typeorm';
import { Contact } from '../models/Contact';

@EntityRepository(Contact)
export class ContactRepository extends MongoRepository<Contact>  {

}