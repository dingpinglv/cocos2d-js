var HitEffect = cc.Sprite.extend({
    active:true,
    ctor:function () {
        this._super("#smallexplosion_0");
        //this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    },
    reset:function (x, y, rotation, scale) {
        this.attr({
	        x: x,
	        y: y,
	        rotation: rotation,
	        scale: scale
        });
        this.runAction(cc.Animate.create(HitEffect.explodeAnimation));
        this.runAction(cc.Sequence.create(cc.FadeOut.create(0.3), cc.CallFunc.create(this.destroy, this)));
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});

HitEffect.getOrCreateHitEffect = function (x, y, rotation, scale) {
    var selChild = null, hits = MW.CONTAINER.HITS;
    for (var j = 0; j < hits.length; j++) {
        selChild = hits[j];
        if (selChild.active == false) {
            selChild.visible = true;
            selChild.active = true;
            selChild.opacity = 255;
            selChild.reset(x, y, rotation, scale);
            return selChild;
        }
    }
    selChild = HitEffect.create();
    selChild.reset(x, y, rotation, scale);
    return selChild;
};

HitEffect.create = function () {
    var hitEffect = new HitEffect();
    g_sharedGameLayer.addBulletHits(hitEffect, 9999);
    MW.CONTAINER.HITS.push(hitEffect);
    return hitEffect;
};

HitEffect.preSet = function () {
    var size = 32;
    var frames = [];
    var rect = cc.rect(0, 0, 32, 32);
    var name = "smallexplosion_";
    var count = 0;
    for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 4; c++) {
            rect.x = c * 32;
            rect.y = r * 32;
            var frame = cc.SpriteFrame.create(res.smallexplode_png, rect);
            cc.spriteFrameCache.addSpriteFrame(frame, name + count);
            frames.push(frame);
            count++;
        }
    }

    HitEffect.explodeAnimation = new cc.Animation(frames, 0.02);

    var hitEffect = null;
    for (var i = 0; i < 10; i++) {
        hitEffect = HitEffect.create();
        hitEffect.setVisible(false);
        hitEffect.active = false;
    }
};

HitEffect.explodeAnimation = null;