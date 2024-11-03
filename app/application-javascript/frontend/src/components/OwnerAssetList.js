import React, { useEffect, useState } from 'react';

const OwnerAssetList = ({ ownerName }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://localhost:4000/assets');
        const data = await response.json();
        // Filter assets that belong to the logged-in owner
        const ownerAssets = data.filter(asset => asset.Owner.toLowerCase() === ownerName.toLowerCase());
        setAssets(ownerAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [ownerName]);

  if (loading) {
    return <div>Loading assets...</div>;
  }

  return (
    <div>
      <h2>Assets owned by {ownerName}</h2>
      {assets.length > 0 ? (
        <ul>
          {assets.map(asset => (
            <li key={asset.ID}>
              <strong>ID:</strong> {asset.ID}, <strong>Color:</strong> {asset.Color}, 
              <strong> Size:</strong> {asset.Size}, <strong>DocumentURL:</strong> {asset.DocumentURL}
            </li>
          ))}
        </ul>
      ) : (
        <div>No assets found for {ownerName}</div>
      )}
    </div>
  );
};

export default OwnerAssetList;

