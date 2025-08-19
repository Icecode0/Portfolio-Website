export async function checkDiscordMembership(accessToken: string): Promise<boolean> {
  const response = await fetch('https://discord.com/api/users/@me/guilds/1307792849076748328/member', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  return response.status === 200;
}

export async function getDiscordUser(accessToken: string) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) return null;
  return response.json();
}