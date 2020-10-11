import React, { useState } from 'react';

export const Counter = props => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>
        {props.type}: {count}
      </p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};
