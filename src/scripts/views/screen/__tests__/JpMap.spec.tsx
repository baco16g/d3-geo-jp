import * as React from 'react';
import {render, cleanup, waitForDomChange, fireEvent} from 'react-testing-library';
import * as fetchMock from 'fetch-mock';
import {mockRandom} from 'jest-mock-random';
import 'jest-dom/extend-expect';
import 'jest-styled-components';
import JpMap from '../JpMap';
import * as coordinates from '../../../../../static/json/coordinates.json';
import * as jpMap from '../../../../../static/json/jp.json';

beforeEach(() => {
  mockRandom(0.5);
  fetchMock.get('/static/json/coordinates.json', coordinates).get('/static/json/jp.json', jpMap);
});
afterEach(() => {
  cleanup();
  fetchMock.restore();
});

it('matches snapshot', async () => {
  const {container, asFragment} = render(<JpMap />);
  await waitForDomChange({container});
  expect(asFragment()).toMatchSnapshot();
});

describe('Japan Map', () => {
  it('the initial value of selected region should be empty', async () => {
    const {container, getByText} = render(<JpMap />);
    await waitForDomChange({container});
    const intialValue = '-'.repeat(24);
    expect(getByText(/name/)).toHaveTextContent(intialValue);
    expect(getByText(/number/)).toHaveTextContent(intialValue);
  });

  it('the value of selected region is updated, when a circle is clicked', async () => {
    const {container, getByText, getByTestId} = render(<JpMap />);
    await waitForDomChange({container});
    fireEvent.click(getByTestId('marker-0'));
    expect(getByText(/name/)).toHaveTextContent('北海道');
    expect(getByText(/number/)).toHaveTextContent(/\d+/);
  });
});
