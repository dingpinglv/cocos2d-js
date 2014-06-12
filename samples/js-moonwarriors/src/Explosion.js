var Explosion = cc.Sprite.extend({
    tmpWidth:0,
    tmpHeight:0,
    active:true,
    animation:null,
    ctor:function () {
        var pFrame = cc.spriteFrameCache.getSpriteFrame("explosion_0");
        this._super(pFrame);
        //this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);

        this.tmpWidth = this.width;
        this.tmpHeight = this.height;
        this.animation = Explosion.explodeAnimation;
    },
    play:function(){
        //return;
        this.runAction(cc.Sequence.create(
            cc.Animate.create(this.animation),
            cc.CallFunc.create(this.destroy, this)
        ));
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

Explosion.sharedExplosion = function () {
    cc.animationCache.addAnimation(Explosion.explodeAnimation, "Explosion");
};

Explosion.getOrCreateExplosion = function () {
    var selChild =null, explosions = MW.CONTAINER.EXPLOSIONS;
    for (var j = 0; j < explosions.length; j++) {
        selChild = explosions[j];
        if (selChild.active == false) {
            selChild.visible = true;
            selChild.active = true;
            selChild.play();
            return selChild;
        }
    }
    selChild = Explosion.create();
    selChild.play();
    return selChild;
};
Explosion.create = function () {
    var explosion = new Explosion();
    g_sharedGameLayer.addExplosions(explosion);
    MW.CONTAINER.EXPLOSIONS.push(explosion);
    return explosion;
};

Explosion.preSet = function () {
    var size = 64;
    var frames = [];
    var rect = cc.rect(0, 0, size, size);
    var name = "explosion_";
    var count = 0;
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 8; c++) {
            rect.x = c * size;
            rect.y = r * size;
            var frame = cc.SpriteFrame.create(res.explode_png, rect);
            cc.spriteFrameCache.addSpriteFrame(frame, name + count);
            frames.push(frame);
            count++;
        }
    }

    Explosion.explodeAnimation = new cc.Animation(frames, 0.02);

    var explosion = null;
    for (var i = 0; i < 6; i++) {
        explosion = Explosion.create();
        explosion.visible = false;
        explosion.active = false;
    }
};

Explosion.explodeAnimation = null;