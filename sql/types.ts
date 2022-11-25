export enum OwnerType {
  User = 0,
  Organization = 1,
}

export interface Owner {
  id: bigint;
  type: OwnerType;
  login: string;
  avatarUrl: string;
  url: string;
  maxCrates: number;
  banned: boolean;
  canCreateCrateWithPush: boolean;
}
