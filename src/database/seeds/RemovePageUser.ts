import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../api/models/User';
export class RemovePageUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const pageUsers: User[] = await em.find(User, { where: { username: 'bruce@spurtcart.com' } });

        for (const user of pageUsers) {
            await em.remove(user);
        }
    }
}
