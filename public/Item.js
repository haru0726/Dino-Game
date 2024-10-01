class Item {
    constructor(ctx, id, x, y, width, height, image) {
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.active = true; // 아이템 활성화 상태
    }

    update(speed, gameSpeed, deltaTime, scaleRatio) {
        this.x -= speed * gameSpeed * deltaTime * scaleRatio;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collideWith = (sprite) => {
        const adjustBy = 1.4;
        const result = (
            this.x < sprite.x + sprite.width / adjustBy &&
            this.x + this.width / adjustBy > sprite.x &&
            this.y < sprite.y + sprite.height / adjustBy &&
            this.y + this.height / adjustBy > sprite.y
        );

        if (result) {
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
        }

        // 충돌
        return result;
    }
}

// 예시: 플레이어 클래스
class Player {
    constructor(ctx, x, y, width, height) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // 기타 메서드...

    checkItemCollision(item) {
        if (item.collideWith(this)) {
            // 아이템을 획득한 경우
            scoreManager.getItem(item.id); // 점수 업데이트
            console.log(`Player collided with item: ${item.id}`);
        }
    }
}


export default Item