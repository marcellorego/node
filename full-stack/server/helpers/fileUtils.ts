import * as fs from 'fs';
import * as path from 'path';

export default class FileUtils {

  private constructor() {}

  public static getChildrenFolders(srcpath: string): Array<string> {
    const files: string [] = fs.readdirSync(srcpath);
    const result = files.map(function (file) {
        const name: string = path.join(srcpath, file);
        return name;
    }).filter(function (file) {
        const isDirectory: boolean = fs.statSync(file).isDirectory();
        return isDirectory;
    });
    return [srcpath].concat(result);
  }

}
