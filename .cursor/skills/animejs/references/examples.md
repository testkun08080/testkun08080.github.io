# Anime.js v4 — examples

## Basic tween

```javascript
import { animate } from 'animejs';

animate('.element', {
  translateX: 250,
  rotate: '1turn',
  duration: 800,
  ease: 'outExpo'
});
```

## Timeline

```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({ defaults: { duration: 500 } });
tl.add('.box1', { x: 100 })
  .add('.box2', { x: 100 }, '<')
  .add('.box3', { x: 100 }, '-=200');
```

## Stagger

```javascript
import { animate, stagger } from 'animejs';

animate('.item', {
  translateY: [-20, 0],
  opacity: [0, 1],
  delay: stagger(100, { from: 'center' }),
  duration: 600
});
```

## Scroll-driven

```javascript
import { animate, onScroll } from 'animejs';

animate('.element', {
  translateX: [0, 500],
  autoplay: onScroll({
    target: '.element',
    sync: true
  })
});
```

## SVG line draw

```javascript
import { animate, createDrawable } from 'animejs';

animate(createDrawable('path'), {
  draw: ['0 0', '0 1'],
  duration: 2000,
  ease: 'inOutQuad'
});
```

## Draggable + spring release

```javascript
import { createDraggable, createSpring } from 'animejs';

createDraggable('.draggable', {
  container: '.container',
  releaseEase: createSpring({ stiffness: 200, damping: 20 })
});
```

## Function-based values

```javascript
import { animate, random } from 'animejs';

animate('.element', {
  translateX: (el, i, total) => i * 50,
  rotate: (el, i) => random(-180, 180),
  delay: (el, i) => i * 100
});
```

## Keyframes

```javascript
import { animate } from 'animejs';

animate('.element', {
  translateX: [
    { to: 100, duration: 500 },
    { to: 0, duration: 500, delay: 200 }
  ],
  rotate: ['0turn', '1turn', '0turn']
});
```

## React + `createScope`

```jsx
import { useRef, useEffect } from 'react';
import { animate, createScope } from 'animejs';

function AnimatedComponent() {
  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    scope.current = createScope({ root: root.current }).add(() => {
      animate('.box', { rotate: 360 });
    });
    return () => scope.current.revert();
  }, []);

  return (
    <div ref={root}>
      <div className="box" />
    </div>
  );
}
```
