export abstract class UserAdapter {
  abstract find(username: string): Promise<any[]>;
  abstract create(userObj: any): Promise<any>;
  abstract update(userObj: any): Promise<any>;
  abstract delete(id: string): Promise<any>;
}
