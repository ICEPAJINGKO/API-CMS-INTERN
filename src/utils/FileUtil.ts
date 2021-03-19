import moment from 'moment';

export class FileUtil {
    public static renameFile(): any {
        return Math.random().toString(36).substring(2, 15) + moment().format('x') + Math.random().toString(36).substring(2, 15);
    }
}
