const LEVEL_STRINGIFY_VERSION = 1;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ACTION_BUTTON = KEY_ENTER;
const VIEW_WIDTH = 1920;
const VIEW_HEIGHT = 1080;
const GROUND_HEIGHT = VIEW_HEIGHT - 128;
const STATS_BAR_HEIGHT = 20;
const STATS_BAR_WIDTH = 200;
const STATS_ROW_HEIGHT = 60;

const GREEN_TURTLE_SPEED = 80;
const RED_TURTLE_SPEED = 80;
const PLAYER_MAX_HSPEED = 350;
const PLAYER_JUMP_VSPEED = -20;
const PLAYER_GRAVITY = 1;
const PLAYER_INVINCIBILITY_DURATION = 3000;
const PLAYER_INJURY_JUMP_VSPEED = -10;

//routes
const ROUTES = [
	'index',
	'stage',
	'lobby',
	'shop',
	'gym'
];

//player stats
const BASE_MONEY = 0;
const BASE_INJURY = 0;
const BASE_HUNGER = 0;
const BASE_STRENGTH = 0;
const BASE_ENERGY = 100;

//player states
const BASE_HAPPINESS = 0;

//general
const MAX_TRAININGS = 1;
const BASE_GYM_FEE = 40;
const MAX_STRENGTH = 100;
const MAX_INJURY = 100;
const MAX_TRAINED = 100;

const MUSHROOM_MODE_TIMEOUT = 1000 * 10; // 10 seconds
