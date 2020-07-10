import { Controller, Get, Params, Query, Post, Body, Header, Ctx, Flow } from 'koa-ts-controllers';
import {IsNumberString, IsNotEmpty} from 'class-validator';
import Boom from '@hapi/Boom';
import { Context } from 'koa';
import authorization from '../middlewares/authorization';

class GetUsersQuery {
    @IsNumberString({
        message: 'page必须是数字'
    })
    page: number;
}

class PostUserBody {
    @IsNotEmpty({
        message: '用户名不能为空'
    })
    name: string;

    @IsNotEmpty({
        message: '密码不能为空'
    })
    password: string;
}

@Controller('/test')
class TestController {
    @Get('/hello')
    async hello(a: any) {
        // console.log(a.b);
        return 'Hello Test!';
    }

    // Params装饰器
    // @Get('/user/:id(\\d+)')
    // async getUser(
    //     @Params() params: {id: number}
    // ) {
    //     return '当前params中的用户id是：' + params.id;
    // }

    // or
    // async getUser(
    //     @Params('id') id: number
    // ) {
    //     return '当前params中的用户id是：' + id;
    // }

    // Query装饰器
    // @Get('/user')
    // async getUser(
    //     @Query() query: {id: number}
    // ) {
    //     return '当前query中的用户id是：' + query.id;
    // }

    // or
    // async getUser(
    //     @Query('id') id: number
    // ) {
    //     return '当前query中的用户id是：' + id;
    // }

    // Body装饰器 & Header装饰器
    @Post('/user')
    async postUser(
        @Ctx() ctx: Context,
        @Body() body: PostUserBody,
        @Header() h: any
    ) {
        // console.log(body);
        // console.log('header', h);
        // return `当前用户提交的数据是：${JSON.stringify(body)}`;
        ctx.status = 201;
        return {
            id: 1,
            name: body.name,
            createdAt: new Date()
        }
    }

    @Get('/users')
    async getUsers(
        @Query() query: GetUsersQuery
    ) {
        // 出现业务逻辑错误
        // if (true) {
        //     throw Boom.notFound('注册失败', '用户名已经被注册');
        // }

        return '传过来的query：' + JSON.stringify(query);
    }

    @Get('/auth')
    @Flow([authorization])
    async auth(
        @Ctx() ctx: Context
    ) {
        return '不登陆看不到'
    }

    @Get('/noauth')
    async noAuth() {
        return '随便看';
    }
}