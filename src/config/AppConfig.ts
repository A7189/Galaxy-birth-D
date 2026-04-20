export const GALAXY_CONFIG = {
    COLOR_CORE: 0xffcc00,
    COLOR_MID: 0xffffcc,
    COLOR_EDGE: 0xff66b2,
    SCALE: 80,
    ROTATION_SPEED: 0.02,
    PARTICLE_SIZE_MIN: 0.19,
    PARTICLE_SIZE_MAX: 20.0,
    PARTICLE_BASE_MULTIPLIER: 1500.0,// <-- Tambahin ini buat ngatur skala dasar dari Config
    MOON_TEXTURE: '/moon.jpg', 
    MOON_SIZE: 30,
};

export const PHOTO_CONFIG = {
    COUNT: 350,
    ORBIT_SPEED_MIN: 0.0003,
    ORBIT_SPEED_MAX: 0.0008,
    SPACING_RADIUS_MIN: 20, 
    SPACING_RADIUS_MAX: 72,
    Y_OFFSET_SPREAD: 15, 
    FLOAT_SPEED: 0.5,
    FLOAT_AMPLITUDE: 1.2,
    PHOTO_WIDTH: 3,
    PHOTO_HEIGHT: 4.2
};

export const EFFECT_CONFIG = {
    BLOOM_STRENGTH: 0.09,
    BLOOM_RADIUS: 10.0,
    BLOOM_THRESHOLD: 1.0
};

export const CAMERA_CONFIG = {
    MIN_DISTANCE: 20,
    MAX_DISTANCE: 180
};