class GlitchPipe extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
    constructor(game)
    {
        var config = {
            game: game,
            renderer: game.renderer,
            fragShader:
            `
                #ifdef GL_ES
                precision mediump float;
                #endif
    
                uniform sampler2D u_sampler;
                varying vec2 outTexCoord;
                uniform float u_time;
                void main(void) {
                    vec4 color = texture2D(u_sampler, outTexCoord);
                    float gray = dot(color.rgb, vec3(0.3, abs(sin(u_time)), 0.3));
                    gl_FragColor = vec4(vec3(gray), 1.0);
                }
            `
        };

        super(config);
    }
}

class EffectsTest extends Phaser.Scene {
    logoIMG;

    constructor(handle, parent) {
        super(handle);
    }

    preload() {
        this.load.image('logo', 'resources/images/source-c0de-logo.png');

        this.glitchPipe = game.renderer.addPipeline('Glitch', new GlitchPipe(game));
    }

    create() {
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        this.logoIMG = this.add.sprite(cameraCenterX, cameraCenterY - (this.cameras.main.height /8), 'logo')
            .setScale(0.2)
            .setDepth(0)
            .setPipeline('Glitch');

        this.tyme = 0;
    }

    update() {
        this.tyme += 0.05;
        this.glitchPipe.setFloat1('u_time', this.tyme);
    }
}