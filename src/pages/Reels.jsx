import React from 'react';
import Wrapper from '../components/Wrapper';
import ReelsHeader from '../components/ReelsHeader';
import ReelsList from '../components/ReelsList';

const Reels = () => (
  <Wrapper style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
    <ReelsHeader />
    <ReelsList />
  </Wrapper>
);

export default Reels; 