<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
@font-face {
  font-family: 'icomoon';
  src: url('~assets/fonts/icomoon.eot?5ri7qz');
  src: url('~assets/fonts/icomoon.eot?5ri7qz#iefix') format('embedded-opentype'),
    url('~assets/fonts/icomoon.ttf?5ri7qz') format('truetype'),
    url('~assets/fonts/icomoon.woff?5ri7qz') format('woff'),
    url('~assets/fonts/icomoon.svg?5ri7qz#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

@font-face {
  src: url('~assets/fonts/PTSans-Regular.ttf');
  font-family: 'PTSans';
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^='icon-'],
[class*=' icon-'] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-cart:before {
  content: '\e900';
}
.icon-cross:before {
  content: '\e901';
}
.icon-star:before {
  content: '\e902';
}
.icon-star-filled:before {
  content: '\e903';
}
.icon-trash:before {
  content: '\e904';
}
.icon-triangle-down:before {
  content: '\e905';
}

html,
body {
  width: 100%;
  height: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
