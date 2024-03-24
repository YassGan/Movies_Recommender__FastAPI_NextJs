// RatedMoviesCount.jsx
const RatedMoviesCount = ({ count }) => {
  return (
    <div style={{
      position: 'absolute', // Absolute positioning
      top: '20px', // Adjust based on your layout
      right: '20px', // Adjust based on your layout
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '10px',
    }}>
      Rated Movies: {count}
    </div>
  );
};

export default RatedMoviesCount;
