import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Ctx,
    Params,
    Query,
    Flow
} from 'koa-ts-controllers';
import {Context} from 'koa';
import authorization from '../middlewares/authorization';
import { getAndValidateBoard } from '../validators/Board';
import {
    PostAddListBody,
    GetListsQuery,
    PutUpdateListBody,
    getAndValidateBoardList
} from '../validators/BoardList';
import { BoardList as BoardListModel } from '../models/BoardList';


@Controller('/list')
@Flow([authorization])
export class BoardListController {

    /**
     * 创建列表
    */
    @Post('')
    public async addList(
        @Ctx() ctx: Context,
        @Body() body: PostAddListBody
    ) {
        let { boardId, name } = body;
        await getAndValidateBoard(boardId, ctx.userInfo.id);

        let maxOrderBoardList = await BoardListModel.findOne({
            where: {
                boardId
            },
            order: [['order', 'desc']]
        })
        
        let boardList = new BoardListModel();
        boardList.userId = ctx.userInfo.id;
        boardList.boardId = boardId;
        boardList.name = name;
        boardList.order = maxOrderBoardList ? maxOrderBoardList.order + 65535: 65535;
        await boardList.save();

        ctx.status = 201;
        return boardList;
    }

    /**
     * 获取当前用户指定看板下的所有列表集合
    */
    @Get('')
    public async getLists(
        @Ctx() ctx: Context,
        @Query() query: GetListsQuery 
    ) {
        let { boardId } = query;

        await getAndValidateBoard(boardId, ctx.userInfo.id);
        
        let boardLists = await BoardListModel.findAll({
            where: {
                boardId
            },
            order: [['order', 'asc']]
        })
        
        return boardLists;
    }

    /**
     * 获取指定列表详情
    */
    @Get('/:id(\\d+)')
    public async getList(
        @Ctx() ctx: Context,
        @Params('id') id: number  
    ) {
        let boardList = await getAndValidateBoardList(id, ctx.userInfo.id);
        return boardList;
    }

    /**
     * 更新指定列表
    */
    @Put('/:id(\\d+)')
    public async updateList(
        @Ctx() ctx: Context,
        @Params('id') id: number,
        @Body() body: PutUpdateListBody
    ) {
        let { boardId, name, order } = body;
        let boardList = await getAndValidateBoardList(id, ctx.userInfo.id);
        boardList.boardId = boardId || boardList.boardId;
        boardList.name = name || boardList.name;
        boardList.order = order || boardList.order;
        await boardList.save();

        ctx.status = 204;
        return boardList;
    }

    /**
     * 删除指定列表
    */
    @Delete('/:id(\\d+)')
    public async deleteList(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let boardList = await getAndValidateBoardList(id, ctx.userInfo.id);
        await boardList.destroy();
        ctx.status = 204;
    }

}