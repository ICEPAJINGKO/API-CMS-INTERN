import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../api/models/User';
export class CreateTestAdminUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const user = new User();
        user.username = 'admin@project_name.com';
        user.password = await User.hashPassword('admin');
        user.email = 'admin@project_name.com';
        // user.isAdmin = true;
        return await em.save(user);
    }
}
