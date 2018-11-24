class Stats {
    constructor() {

        this.graphics = new PIXI.Graphics();
        application.hud.addChild(this.graphics);
    }

    update(stats) {
        this.graphics.clear();

        Object.keys(stats).forEach((statName, index) => {
             const text = new PIXI.Text(statName, {
                 fontFamily : 'Arial',
                 fontSize: 24,
                 fill : 0xff1010,
                 align : 'center'
             });
             text.y = index * STATS_ROW_HEIGHT;
             const statValue = stats[statName];
             const barWidth = statValue / 100 * STATS_BAR_WIDTH;
             this.graphics.addChild(text);
             this.graphics.beginFill(0xFF0000, 1);
             this.graphics.drawRect(0, index * STATS_ROW_HEIGHT + 30, barWidth, STATS_BAR_HEIGHT);
             this.graphics.endFill();
        });
    }
}