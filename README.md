## Note

Help you customize and manage gesture action in web. 
It can work well with JS, React or Vue

add issues if you need more features :)

## Installation

``` 
npm install gesture-customizer
```

OR

``` 
yarn add gesture-customizer
```

## Usage

``` javascript
import {
    Gesture
} from 'gesture-customizer';

const callbackFn = () => {
    // ...do something
}

// registry a gesture listener.
Gesture.registry(
    // listen left-right mousedown with pressing ctrl key
    {
        mouseType: 'LR', 
        ctrlKey: true
    },

    // trigger callback when the mouse moves toward bottom more than 300px
    // and then move towards right less than 500px in 2 seconds
    // and move top more than 300px at the end
    [
        {
            direction: 'B',
            minDistance: 300
        },
        {
            direction: 'R',
            maxDistance: 500,
            maxSpendTime: 2000,
        },
        {
            direction: 'T',
            minDistance: 300
        }
    ],

    callbackFn
);

// remove a gesture listener.
Gesture.remove({
    mouseType: 'LR'
}, callbackFn);

// pause all gesture listener
Gesture.pause();

// resueme all gesture listener
Gesture.resume();
```

<br>
<br>

## API docs

> ### interface `KeyType`

Define the gesture trigger buttons. It can combine with `ctrl` and `shift` key.

| Arguments   |                                                                                  description |    Accepted Values     | Default |
|-------------|---------------------------------------------------------------------------------------------:|:----------------------:|:-------:|
| `mouseType` | which mouse buttons can trigger callback, `L` = `Left`, `R` = `Right`, `M` = `Middle`(wheel) | `L` / `R` / `LR` / `M` |         |
| `ctrlKey?`  |                                               only trigger event when `ctrl` key was pressed |       `boolean`        |  false  |
| `shiftKey?` |                                              only trigger event when `shift` key was pressed |       `boolean`        |  false  |

<br>
<br>

> ### interface `GestureAction`

Define the mouse move path, only trigger callback when user did action which is satisfied all limitation.

| Arguments       |                                                         description | Accepted Values | Default  |
|-----------------|--------------------------------------------------------------------:|:---------------:|:--------:|
| `direction`     |                                            the mouse move direction |   `Direction`   |          |
| `minDistance?`  |  Not trigger callback if moving distance is less than `minDistance` |    `number`     |   100    |
| `maxDistance?`  | Not trigger callback if moving distance is large than `maxDistance` |    `number`     | infinity |
| `maxSpendTime?` |                     The maxium spends time on user done this action |    `number`     | infinity |

``` typescript
/** T = Top
 *  R = Right
 *  B = Bottom
 *  L = Left
*/ 
type Direction = 'T' | 'TR' | 'R' | 'RB' | 'B' | 'BL' | 'L' | 'LT';
```

<br>
<br>

> ### Gesture. registry(keyType, gestureAction[], callback)

registry a gesture listener.

> ### Gesture. remove(keyType, callback)

remove a gesture listener.

> ### Gesture. pause()

pause all gesture listener

> ### Gesture. resume()

resueme all gesture listener

## License

MIT