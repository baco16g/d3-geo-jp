import * as React from 'react';
import styled, {keyframes} from 'styled-components';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';

import useJpInfo, {InfoData} from '../../hooks/useJpInfo';
import Button from '../atoms/Button';
import Card from '../organisms/Card';

const JP_POS = [46, 150, 24, 120];

const JpMap = () => {
  // Initialize
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [mapSize] = React.useState<{w: number; h: number}>({w: 600, h: 600});
  const [jpMapData, setJpMapData] = React.useState<any[]>([]);
  const [jpInfoData, setJpInfodData] = React.useState<InfoData[]>([]);
  const [selectedCity, setSelectedCity] = React.useState<InfoData | null>(null);
  const {data: infoData, update} = useJpInfo();

  // Effects
  React.useEffect(() => {
    if (!mounted) {
      getMapData();
      setMounted(true);
    }
    setJpInfodData(infoData);
  }, [infoData]);

  // Handlers
  const getMapData = async () => {
    const response = await fetch('/static/json/jp.json');
    if (response.status !== 200) throw new Error(`There was a problem: ${response.status}`);
    const data = await response.json();
    const featureCollection = feature(data, data.objects.subunits_jp) as any;
    setJpMapData(featureCollection.features);
  };

  const projection = React.useCallback(() => {
    const [n, e, s, w] = JP_POS;
    const {w: width, h: height} = mapSize;
    return geoMercator()
      .center([(w + e) / 2, (n + s) / 2])
      .scale(width / (2 * Math.PI * ((e - w) / 360)))
      .translate([width / 2, height / 2]);
  }, []);

  const maximumOfPopulation = React.useMemo(() => Math.max(...jpInfoData.map(o => o.population)), [
    jpInfoData,
  ]);
  const adjustScaleOfMarkers = React.useCallback(
    (n: number, maximum: number) => (n / maximum) * 100,
    []
  );
  const determineFillByScale = React.useCallback((n: number) => `hsl(45, ${n}%, 60%, 75%)`, []);

  const thunkOfHandleClickOnMarker = React.useCallback(
    (city: InfoData) => () => {
      setSelectedCity(city);
    },
    []
  );

  // Render
  return (
    <MapSvgWrapper>
      <svg width={mapSize.w} height={mapSize.h} viewBox={`0 0 ${mapSize.w} ${mapSize.h}`}>
        <g>
          {jpMapData.map((d, i) => {
            const _d = geoPath().projection(projection())(d);
            return _d ? <path key={`path-${i}`} d={_d} fill="#fff" /> : null;
          })}
        </g>
        <g>
          {jpInfoData.map((city, i) => {
            const p = projection()(city.coordinates);
            const percentByPopulation = adjustScaleOfMarkers(city.population, maximumOfPopulation);
            return p ? (
              <Marker
                key={`marker-${i}`}
                cx={p[0]}
                cy={p[1]}
                fill={determineFillByScale(percentByPopulation)}
                r={percentByPopulation * 0.5}
                onClick={thunkOfHandleClickOnMarker(city)}
              />
            ) : null;
          })}
        </g>
      </svg>
      <CardWrapper>
        <Card>
          <CardInner>
            <h3>Selected region</h3>
            <p>name: {selectedCity ? selectedCity.name : '------------------------'}</p>
            <p>
              number:{' '}
              {selectedCity ? Math.round(selectedCity.population) : '------------------------'}
            </p>
          </CardInner>
        </Card>
      </CardWrapper>
      <Button
        label="Update a Data!"
        onPress={() => {
          setSelectedCity(null);
          update();
        }}
      />
    </MapSvgWrapper>
  );
};

const MapSvgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const scale = (purpose: number) => keyframes`
  from {
    r: 0;
  }
  to {
    r: ${purpose};
  }
`;

const Marker = styled.circle<{
  r: number;
}>`
  animation: ${props => scale(props.r)} 2s ease;
  cursor: pointer;
`;

const CardWrapper = styled.div`
  margin: -24px 0 24px;
`;

const CardInner = styled.div`
  h3 {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 18px;
  }
  p {
    line-height: 2;
  }
`;

export default JpMap;