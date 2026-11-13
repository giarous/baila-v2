import React from 'react';
import renderer, {act} from 'react-test-renderer';
import App from '../App';

it('opens directly on the redesigned home screen', () => {
  let app;
  act(() => {
    app = renderer.create(<App />);
  });
  expect(app.root.findByProps({testID: 'start-game'}).props.disabled).toBe(
    false,
  );
  act(() => {
    app.unmount();
  });
});
