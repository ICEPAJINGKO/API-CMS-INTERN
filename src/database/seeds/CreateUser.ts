import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../api/models/User';
export class CreateUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const user = new User();
        user.username = 'user1@project_name.com';
        user.password = await User.hashPassword('user1');
        user.email = 'user1@project_name.com';
        // user.isAdmin = false;
        return await em.save(user);
    }
}
