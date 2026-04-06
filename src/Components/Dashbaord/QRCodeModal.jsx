import React from 'react';
import { FaTimes, FaDownload, FaShare } from 'react-icons/fa';
import './QRCodeModal.css';

const QRCodeModal = ({ isOpen, onClose, type, userName }) => {
  if (!isOpen) return null;

  const callType = type === 'video' ? 'Video Call' : 'Voice Call';
  
  // App download links
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.yourcompany.yourapp";
  const appStoreLink = "https://apps.apple.com/us/app/yourapp-name/id1234567890";
  
  // For QR code, you can use a service that generates QR codes with app store detection
  // This QR code will open Play Store on Android and App Store on iOS
  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://yourdomain.com/download-app?user=${userName}&type=${type}`)}`;

  // Smart URL that redirects to appropriate store
  const smartDownloadLink = "https://yourdomain.com/download-app";

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `${userName}-${callType}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareText = `Download our app to start a ${callType.toLowerCase()} with ${userName}. Available on both Android and iOS!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Start ${callType} with ${userName}`,
          text: shareText,
          url: smartDownloadLink,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(smartDownloadLink)
        .then(() => alert('Download link copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  return (
    <div className="qrModalOverlay" onClick={onClose}>
      <div className="qrModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="qrModalHeader">
          <h3>Start {callType}</h3>
          <button className="closeButton" style={{ position: "static"}} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="qrModalBody">
          <div className="qrInfo">
            <p>
              To start a {callType.toLowerCase()} with <strong>{userName}</strong>, 
              scan this QR code to download our app.
            </p>
          </div>

          <div className="qrCodeContainer">
            <img src={qrCodeImage} alt="QR Code" className="qrCodeImage" />
            <div className="qrScanText">Scan QR Code</div>
          </div>

          <div className="storeButtons">
            <a href={playStoreLink} target="_blank" rel="noopener noreferrer" className="storeBtn playStoreBtn">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                className="storeBadge"
              />
            </a>
            <a href={appStoreLink} target="_blank" rel="noopener noreferrer" className="storeBtn appStoreBtn">
              <img 
                src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" 
                alt="Download on the App Store" 
                className="storeBadge"
              />
            </a>
          </div>

          <div className="qrInstructions">
            <h4>How to use:</h4>
            <ol>
              <li>Scan the QR code with your phone camera</li>
              <li>Download our app from your device's app store</li>
              <li>Install and open the app</li>
              <li>Start your {callType.toLowerCase()} with {userName}</li>
            </ol>
          </div>
        </div>

        <div className="qrModalFooter">
          <button className="qrActionBtn secondary" onClick={handleDownloadQR}>
            <FaDownload />
            Download QR
          </button>
          <button className="qrActionBtn primary" onClick={handleShare}>
            <FaShare />
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;