import React from 'react';

const ChattingWelcomeScreen = ({ mainMsg, secondaryMsg }) => {
  return (
    <div className="d-none d-md-flex welcome-screen">
      <h2 className="text-primary mb-3">{mainMsg}</h2>
      <h5 className="mt-3">{secondaryMsg}</h5>
    </div>
  );
};

export default ChattingWelcomeScreen;
