import { hashPassword } from './utils/hash';
import prisma from './utils/prisma';
import { CreateUserInput } from './modules/user/user.schema';

// We could type input as Pick<UserCreateInput, [email, name, password]>
// or something like that and that would work fine. But using Zod here
// instead for easy schema validation and error messages
export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}
