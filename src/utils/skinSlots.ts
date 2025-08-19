const ROLE_SLOT_MAP = {
  '1308103830956806204': [3], // Tier 1
  '1308103869380694037': [3, 4], // Tier 2
  '1308103913161101475': [3, 4, 5], // Tier 3
  '1308103945750712391': [3, 4, 5, 6], // Tier 4
  '1308103972535402546': [3, 4, 5, 6, 7, 8], // Tier 5
  '1307793767662751895': [3, 4, 5, 6, 7], // Owner
  '1307793972026015876': [3, 4, 5, 6], // Head Staff
  '1307794034311303239': [3, 4], // Staff
} as const;

export function getUserAvailableSlots(roles: string[]): number[] {
  // Slots 1 and 2 are always available
  const availableSlots = new Set([1, 2]);

  // Add slots based on roles
  roles.forEach(role => {
    if (role in ROLE_SLOT_MAP) {
      ROLE_SLOT_MAP[role as keyof typeof ROLE_SLOT_MAP].forEach(slot => {
        availableSlots.add(slot);
      });
    }
  });

  return Array.from(availableSlots).sort((a, b) => a - b);
}

export function initializeSkinSlots(roles: string[], userData: UserData): SkinSlot[] {
  const availableSlots = getUserAvailableSlots(roles);
  
  return Array.from({ length: 8 }, (_, index) => {
    const slotNumber = index + 1;
    const customField = `custom${slotNumber}` as keyof UserData;
    const timerField = `custom${slotNumber}timer` as keyof UserData;
    
    return {
      id: slotNumber,
      isActive: userData.activeSkin === userData[customField],
      isSelected: false,
      isLocked: !availableSlots.includes(slotNumber),
      skin: userData[customField] as string | null,
      timer: userData[timerField] as Date | null
    };
  });
}