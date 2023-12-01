import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';

import AuthModule from './auth/auth.module';
import UsersModule from './users/users.module';
import ProductsModule from './products/products.module';
import CategoriesModule from './categories/categories.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/users', module: UsersModule },
      { path: '/products', module: ProductsModule },
      { path: '/categories', module: CategoriesModule },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
  ],
})
export default class V1Module {}
