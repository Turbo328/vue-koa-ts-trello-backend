import {
    IsNumberString,
    Min,
    IsNotEmpty,
    ValidateIf,
    IsNumber
} from 'class-validator';
import Boom from '@hapi/Boom';
import { BoardList as BoardListModel } from '../models/BoardList'

export class PostAddListBody {
    @Min(1, {
        message: '看板id不能为空且必须是数字'
    })
    boardId: number;

    @IsNotEmpty({
        message: '列表名称不能为空'
    })
    name: string;
}

export class GetListsQuery {
    @IsNumberString({
        message: '看板id不能为空且必须为数字'
    })
    boardId: number;
}

export class PutUpdateListBody {
    @ValidateIf(o => o.boardId !== undefined)
    @Min(1, {
        message: '看板id不能为空且必须是数字'
    })
    boardId: number;

    @ValidateIf(o => o.name !== undefined)
    @IsNotEmpty({
        message: '列表名称不能为空'
    })
    name: string;

    @ValidateIf(o => o.order !== undefined)
    @IsNumber({}, {
        message: '列表名称不能为空'
    })
    order: number;
}

export async function getAndValidateBoardList(id: number, userId: number): Promise<BoardListModel> {
    let boardList = await BoardListModel.findByPk(id);

    if (!boardList) {
        throw Boom.notFound('指定列表不存在');
    }

    if (boardList.userId !== userId) {
        throw Boom.forbidden('禁止访问该列表');
    }

    return boardList;
}