/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { describe, test } from 'vitest'
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'
import { DatabaseModule } from 'src/infra/database/database.module';
import { UserFactory } from 'test/factory/make-user';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';

describe('Edit User e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  // let userFactory: UserFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule, DatabaseModule],
        providers: [UserFactory]
      }).compile();
    
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    // userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
  
    await app.init()
  });

  test('[PUT] should be abble to edit user E2E', async () => {
    // const user = await userFactory.makePrismaUser()

    const user = await prisma.user.create({
      data: {
        name: 'Vinicius Silva',
        cpf: '03544587432',
        password: await hash('123456', 8),
        role: 'Admin'
      }
    })
    const accessToken = jwt.sign({ sub: user.id})
    const userId = user.id.toString()

    const result = await request(app.getHttpServer())
    .put(`/user/${userId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      password: user.password,
      role: 'Entregador'
    })
    

    expect(result.statusCode).toBe(204)

    // const userOnDatabase = await prisma.user.findFirst({
    //   where: {
    //     role: 'Admin'
    //   }
    // })

    // expect(userOnDatabase).toBeTruthy()
  })
})
