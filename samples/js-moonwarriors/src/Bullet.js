//bullet
var Bullet = cc.Sprite.extend({
    active:true,
    xVelocity:0,
    yVelocity:200,
    power:1,
    HP:1,
    moveType:null,
    zOrder:3000,
    attackMode:MW.ENEMY_MOVE_TYPE.NORMAL,
    parentType:MW.BULLET_TYPE.PLAYER,
    _collideRect:null,
    ctor:function (bulletSpeed, weaponType, attackMode) {
        this._super("#"+weaponType);

        this.yVelocity = -bulletSpeed;
        this.attackMode = attackMode;
        this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this._collideRect = cc.rect(-3, -3, 6, 6);
    },
    update:function (dt) {
        var x = this.x, y = this.y;
        this.x = x - this.xVelocity * dt;
	    this.y = y - this.yVelocity * dt;
        if (x < 0 || x > g_sharedGameLayer.screenRect.width || y < 0 || y > g_sharedGameLayer.screenRect.height || this.HP <= 0) {
            this.destroy();
        }
    },
    destroy:function () {
        HitEffect.getOrCreateHitEffect(this.x, this.y, Math.random() * 360, 0.75);
        this.active = false;
        this.visible = false;
    },
    hurt:function () {
        this.HP--;
    },
    collideRect:function (x, y) {
        var locRect = this._collideRect;
        locRect.x = x - 3;
        locRect.y = y - 3;
        return locRect;
    }
});

Bullet.getOrCreateBullet = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
    /**/
    var j, selChild = null;
    if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
        var playerBullets = MW.CONTAINER.PLAYER_BULLETS;
        for (j = 0; j < playerBullets.length; j++) {
            selChild = playerBullets[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    } else {
        var enemyBullets = MW.CONTAINER.ENEMY_BULLETS;
        for (j = 0; j < enemyBullets.length; j++) {
            selChild = enemyBullets[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    }
    selChild = Bullet.create(bulletSpeed, weaponType, attackMode, zOrder, mode);
    return selChild;
};

Bullet.create = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
    var bullet = new Bullet(bulletSpeed, weaponType, attackMode);
    g_sharedGameLayer.addBullet(bullet, zOrder, mode);
    if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
        MW.CONTAINER.PLAYER_BULLETS.push(bullet);
    } else {
        MW.CONTAINER.ENEMY_BULLETS.push(bullet);
    }
    return bullet;
};

Bullet.preSet = function () {
    var bullet = null, i;
    for (i = 0; i < 10; i++) {
        bullet = Bullet.create(MW.BULLET_SPEED.SHIP, "W1.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.PLAYER_BULLET);
        bullet.visible = false;
        bullet.active = false;
    }
    for (i = 0; i < 10; i++) {
        bullet = Bullet.create(MW.BULLET_SPEED.ENEMY, "W2.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.ENMEY_BULLET);
        bullet.visible = false;
        bullet.active = false;
    }
};
