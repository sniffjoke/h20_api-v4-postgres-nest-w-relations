import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../posts/api/models/output/post.view.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class LikeHandler {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
  }

  async postHandler(likeStatus: string, post: any, user: any) {
    const isLikeObjectForCurrentUserExists: any | null = await this.dataSource.query(
      `
              SELECT * 
              FROM likes
              WHERE "userId" = $1 AND "postId" = $2
      `,
      [
        user.id,
        post.id,
      ],
    );
    if (!isLikeObjectForCurrentUserExists.length) {
      const newLike = await this.dataSource.query(
        `
                INSERT INTO likes ("status", "userId", "postId") 
                VALUES ($1, $2, $3)
        `,
        [
          LikeStatus.None,
          user.id,
          post.id,
        ],
      );
    }
    const findedLike: any | null = await this.dataSource.query(
      `
              SELECT l.*, e.*
              FROM likes l
              INNER JOIN "extendedLikesInfo" e
              ON e."postId" = l."postId"
              WHERE "userId" = $1 AND l."postId" = $2
      `,
      [
        user.id,
        post.id,
      ],
    ); // Пессимистическая блокировка
    if (findedLike[0].status === likeStatus) {
      const updateLikeStatus = null;
    } else {
      const updateLikeStatus = await this.dataSource.query(
        `
                UPDATE likes 
                SET status = $1 
                WHERE "id" = $2
        `,
        [
          likeStatus,
          findedLike[0].id,
        ],
      );
      const dislikeCount = findedLike[0].dislikesCount;
      const likeCount = findedLike[0].likesCount;
      if (likeStatus === LikeStatus.Like) {
        if (dislikeCount > 0 && findedLike[0]?.status === LikeStatus.Dislike) {
          const updatePostInfo = await this.dataSource.query(
            `
                    UPDATE "extendedLikesInfo" 
                    SET "likesCount" = "likesInfoLikesCount" + 1, "dislikesCount" = "dislikesCount" - 1
                    WHERE "postId" = $1
            `,
            [post.id],
          );
        } else {
          const updatePostInfo = await this.dataSource.query(
            `
                    UPDATE "extendedLikesInfo" 
                    SET "likesCount" = "likesCount" + 1
                    WHERE "postId" = $1
            `,
            [post.id]
          );
        }
      }
      if (likeStatus === LikeStatus.Dislike) {
        if (likeCount > 0 && findedLike[0]?.status === LikeStatus.Like) {
          const updatePostInfo = await this.dataSource.query(
            `
                    UPDATE "extendedLikesInfo" 
                    SET "likesCount" = "likesCount" - 1, "dislikesCount" = "dislikesCount" + 1
                    WHERE "postId" = $1
            `,
            [post.id],
          );
        } else {
          const updatePostInfo = await this.dataSource.query(
            `
                    UPDATE "extendedLikesInfo" 
                    SET "dislikesCount" = "dislikesCount" + 1
                    WHERE "postId" = $1
            `,
            [post.id]
          );
        }
      }

      if (likeStatus === LikeStatus.None) {
        if (findedLike[0]?.status === LikeStatus.Like) {
          const updatePostInfo = await this.dataSource.query(
            `
                    UPDATE "extendedLikesInfo" 
                    SET "likesCount" = "likesCount" - 1
                    WHERE "postId" = $1
            `,
            [post.id]
          );
        } else {
          const updatePostInfo = await this.dataSource.query(
            `
                    UPDATE "extendedLikesInfo" 
                    SET "dislikesCount" = "dislikesCount" - 1
                    WHERE "postId" = $1
            `,
            [post.id]
          );
        }
      }
    }
  }

  async commentHandler(likeStatus: string, comment: any, user: any) {
    const isLikeObjectForCurrentUserExists: any | null = await this.dataSource.query(
      `
              SELECT * 
              FROM likes
              WHERE "userId" = $1 AND "commentId" = $2
      `,
      [
        user.id,
        comment.id,
      ],
    );
    if (!isLikeObjectForCurrentUserExists.length) {
      const newLike = await this.dataSource.query(
        `
                INSERT INTO likes ("status", "userId", "commentId") 
                VALUES ($1, $2, $3)
        `,
        [
          LikeStatus.None,
          user.id,
          comment.id,
        ],
      );
    }
    const findedLike: any | null = await this.dataSource.query(
      `
              SELECT l.*, i.* 
              FROM likes l
              INNER JOIN "likesInfo" i 
              ON l."commentId" = i."commentId"
              WHERE "userId" = $1 AND i."commentId" = $2
      `,
      [
        user.id,
        comment.id,
      ],
    );
    if (findedLike[0]?.status === likeStatus) {
      const updateLikeStatus = null;
    } else {
      const updateLikeStatus = await this.dataSource.query(
        `
                UPDATE likes 
                SET status = $1 
                WHERE "id" = $2
        `,
        [
          likeStatus,
          findedLike[0].id,
        ],
      );
      const dislikeCount = findedLike[0].dislikesCount;
      const likeCount = findedLike[0].likesCount;
      if (likeStatus === LikeStatus.Like) {
        if (dislikeCount > 0 && findedLike[0]?.status === LikeStatus.Dislike) {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "likesCount" = "likesCount" + 1, "dislikesCount" = "dislikesCount" - 1
                    WHERE "commentId" = $1
            `,
            [comment.id],
          );
        } else {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "likesCount" = "likesCount" + 1
                    WHERE "commentId" = $1
            `,
            [comment.id]
          );
        }
      }
      if (likeStatus === LikeStatus.Dislike) {
        if (likeCount > 0 && findedLike[0]?.status === LikeStatus.Like) {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "likesCount" = "likesCount" - 1, "dislikesCount" = "dislikesCount" + 1
                    WHERE "commentId" = $1
            `,
            [comment.id],
          );
        } else {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "dislikesCount" = "dislikesCount" + 1
                    WHERE "commentId" = $1
            `,
            [comment.id]
          );
        }
      }
      if (likeStatus === LikeStatus.None) {
        if (findedLike[0]?.status === LikeStatus.Like) {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "likesCount" = "likesCount" - 1
                    WHERE "commentId" = $1
            `,
            [comment.id]
          );
        } else {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "dislikesCount" = "dislikesCount" - 1
                    WHERE "commentId" = $1
            `,
            [comment.id]
          );
        }
      }
    }
  }

}
