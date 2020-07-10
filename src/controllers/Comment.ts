import {
    Controller,
    Flow,
    Get,
    Post,
    Put,
    Delete,
    Ctx,
    Params,
    Body,
    Query
} from 'koa-ts-controllers';
import { Context } from 'koa';
import authorization from '../middlewares/authorization';
import { PostAddCommentBody, GetCommentsQuery } from '../validators/Comment';
import { getAndValidateBoardListCard } from '../validators/BoardListCard';
import { Comment as CommentModel } from '../models/Comment';
import { User as UserModel } from '../models/User';

@Controller('/comment')
@Flow([authorization])
export class CommentController {

    /**
     * 添加评论
     */
    @Post('')
    public async addComment(
        @Ctx() ctx: Context,
        @Body() body: PostAddCommentBody
    ) {
        let { boardListCardId, content } = body;
        await getAndValidateBoardListCard(boardListCardId, ctx.userInfo.id);

        let comment = new CommentModel();
        comment.userId = ctx.userInfo.id;
        comment.boardListCardId = boardListCardId;
        comment.content = content;
        
        await comment.save();
        
        ctx.status = 201;
        return comment;

    }

    /**
     * 获取评论
     */
    @Get('')
    public async getComments(
        @Ctx() ctx: Context,
        @Query() query: GetCommentsQuery
    ) {
        let { boardListCardId, page } = query;

        await getAndValidateBoardListCard(boardListCardId, ctx.userInfo.id);

        let where = {
            boardListCardId
        }

        // 查询评论总数
        let commentCount = await CommentModel.count({where});

        // 查询具体的评论信息
        // 每页的条数
        let limit = 10;
        let pages = Math.ceil(commentCount / limit);
        page = page ? Number(page) : 1;
        page = Math.min(page, pages);
        page = Math.max(page, 1);

        let comments = await CommentModel.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
            order: [['id', 'desc']],
            include: [
                {
                    model: UserModel,
                    attributes: ['id', 'name']
                }
            ]
        });

        return {
            limit,
            page,
            pages,
            ...comments
        }
        
    }
}