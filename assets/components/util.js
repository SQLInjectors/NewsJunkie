export const sendImpression = ({
    profile_id,
    token,
    type,
    content_id,
    reco_id,
    percentage_viewed,
    duration_viewed
  }) => {
    console.log('hit');
    return fetch(`http://raas-se-prod.cognik.us/v1/accounts/hackathon04/profiles/${profile_id}/actions`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-app-token': token,
        'x-patform-id': 'mobile'
      },
      body: JSON.stringify({
        'content_id': content_id,
        'reco_id': reco_id,
        'type': type,
        'percentage_viewed': percentage_viewed,
        'duration_viewed': duration_viewed
      }),
  };
};
