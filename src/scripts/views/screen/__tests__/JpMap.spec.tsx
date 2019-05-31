import * as React from 'react';
import {render, cleanup, waitForDomChange} from 'react-testing-library';
import * as fetchMock from 'fetch-mock';
import {mockRandom} from 'jest-mock-random';
import 'jest-dom/extend-expect';
import 'jest-styled-components';
import JpMap from '../JpMap';
import * as coordinates from '../../../../../static/json/coordinates.json';
import * as jpMap from '../../../../../static/json/jp.json';

beforeEach(fetchMock.restore);
afterEach(cleanup);

it('matches snapshot', async () => {
  mockRandom(0.5);
  fetchMock.get('/static/json/coordinates.json', coordinates).get('/static/json/jp.json', jpMap);
  const {container, asFragment} = render(<JpMap />);
  await waitForDomChange({container});
  fetchMock.restore();
  expect(asFragment()).toMatchSnapshot();
});
