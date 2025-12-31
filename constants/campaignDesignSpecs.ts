/**
 * Campaign Screen Design Specs - Extracted from Figma
 * 
 * Source: Figma Design (node-id: 20-1623)
 * File: LxG6odFxFqQUcthqCy1lzR
 * 
 * This file contains all design values from Figma for pixel-perfect implementation.
 * All values are in pixels (px) as specified in Figma.
 * 
 * Usage:
 * import { CAMPAIGN_DESIGN_SPECS } from '@/constants/campaignDesignSpecs';
 * 
 * const color = CAMPAIGN_DESIGN_SPECS.colors.background.primary;
 * const spacing = CAMPAIGN_DESIGN_SPECS.spacing.cardPadding;
 */

export const CAMPAIGN_DESIGN_SPECS = {
  // Colors - exact hex codes from Figma
  colors: {
    background: {
      primary: '#1e1f23',      // Main container background
      header: '#1a1b1e',      // Header background
      card: '#26282c',        // Mission card background
      button: '#2c2e33',      // Button background
      endlessCard: 'rgba(255,255,255,0)', // Endless card background (transparent)
    },
    
    border: {
      container: '#3a3b3f',   // Main container border
      header: '#333',         // Header border
      button: '#444',         // Button border
      card: '#1a1b1e',       // Card bottom border (4px)
      cardSubtle: 'rgba(255,255,255,0.05)', // Card subtle border
      endless: '#a05528',     // Endless card border (2px)
      levelNumber: '#3a3c40', // Level number circle border
      premium: '#8a6e28',     // Premium badge border
    },
    
    text: {
      title: '#e4d4b5',       // Main titles (CAMPAIGN, level names)
      description: '#8a8a8a', // Descriptions
      number: '#c0c0c0',      // Level numbers
      button: '#c0c0c0',      // Button text
      locked: '#8a8a8a',      // Locked text
      premium: '#422b05',     // Premium badge text
      endlessTitle: '#e4d4b5', // Endless mode title
      endlessDesc: '#9ca3af',  // Endless mode description
    },
    
    gradient: {
      levelNumber: {
        from: '#4a4c50',
        to: '#1e2023',
        via: undefined,
      },
      premiumBadge: {
        from: '#f5d46f',
        via: '#d4a03f',
        to: '#b5832c',
      },
      endlessIcon: {
        from: '#3e2a20',
        to: '#261a15',
      },
      endlessImage: {
        from: '#26282c',
        to: 'rgba(0,0,0,0)',
      },
    },
    
    overlay: {
      locked: 'rgba(0,0,0,0.6)', // Locked overlay
      image: 'rgba(0,0,0,0)',    // Image overlay (transparent)
    },
  },
  
  // Spacing - exact pixel values from Figma
  spacing: {
    // Container padding
    containerPadding: 12,      // px - Main container horizontal padding
    containerVerticalPadding: 16, // px - Main container vertical padding
    
    // Header
    headerHeight: 56,          // px - Header height
    headerPadding: 12,         // px - Header horizontal padding
    headerGap: 16,            // px - Gap between header elements
    
    // Buttons
    buttonPaddingX: 13,       // px - Button horizontal padding
    buttonPaddingY: 1,        // px - Button vertical padding
    buttonGap: 4,             // px - Gap between button icon and text
    buttonSize: 34,           // px - Square button size (stats/settings)
    
    // Cards
    cardPadding: 12,          // px - Card internal padding
    cardGap: 12,              // px - Gap between card elements
    cardBorderRadius: 14,     // px - Card border radius
    cardBottomBorder: 4,      // px - Card bottom border width
    cardGapVertical: 28,      // px - Gap between cards in grid
    
    // Level number circle
    levelNumberSize: 48,      // px - Level number circle size
    levelNumberBorder: 1,     // px - Level number circle border width
    
    // Endless card
    endlessCardHeight: 96,    // px - Endless card height
    endlessCardPadding: 10,    // px - Endless card left padding
    endlessCardGap: 8,        // px - Gap between endless card elements
    endlessIconSize: 56,      // px - Endless icon container size
    endlessIconInner: 32,     // px - Endless icon inner size
    endlessImageWidth: 128,   // px - Endless image width
    
    // Section headers
    sectionHeaderGap: 24,     // px - Gap between sections
    sectionTitleGap: 8,       // px - Gap below section title
    
    // Text spacing
    textGap: 4,               // px - Gap between text elements
  },
  
  // Typography - exact values from Figma
  typography: {
    headerTitle: {
      fontSize: 20,           // px
      fontWeight: '700',      // Inter Bold
      letterSpacing: 1.5508, // px
      lineHeight: 28,         // px
      color: '#e4d4b5',
      textTransform: 'uppercase' as const,
    },
    
    buttonText: {
      fontSize: 14,           // px
      fontWeight: '700',      // Inter Bold
      letterSpacing: 0.1996,  // px
      lineHeight: 20,         // px
      color: '#c0c0c0',
      textTransform: 'uppercase' as const,
    },
    
    starsCounter: {
      fontSize: 12,           // px
      fontWeight: '700',      // Inter Bold
      letterSpacing: 0,       // px
      lineHeight: 16,         // px
      color: '#8a8a8a',
      textTransform: 'uppercase' as const,
    },
    
    sectionTitle: {
      fontSize: 14,          // px
      fontWeight: '700',      // Inter Bold
      letterSpacing: 0.5496,  // px
      lineHeight: 20,         // px
      color: '#e4d4b5',
      textTransform: 'uppercase' as const,
    },
    
    levelName: {
      fontSize: 14,          // px
      fontWeight: '700',      // Inter Bold
      letterSpacing: 0.1996,  // px
      lineHeight: 17.5,       // px
      color: '#e4d4b5',
      textTransform: 'uppercase' as const,
    },
    
    levelDescription: {
      fontSize: 10,          // px
      fontWeight: '500',     // Inter Medium
      letterSpacing: 0.1172, // px
      lineHeight: 13.75,      // px
      color: '#8a8a8a',
    },
    
    levelNumber: {
      fontSize: 24,          // px
      fontWeight: '700',      // Inter Bold
      letterSpacing: 0.0703,  // px
      lineHeight: 32,         // px
      color: '#c0c0c0',
    },
    
    lockedText: {
      fontSize: 10,          // px
      fontWeight: '700',     // Inter Bold
      letterSpacing: 1.1172, // px
      lineHeight: 15,        // px
      color: '#8a8a8a',
      textTransform: 'uppercase' as const,
    },
    
    premiumBadge: {
      fontSize: 8,           // px
      fontWeight: '700',     // Inter Bold
      letterSpacing: 1.0057, // px
      lineHeight: 12,        // px
      color: '#422b05',
      textTransform: 'uppercase' as const,
    },
    
    endlessTitle: {
      fontSize: 18,          // px
      fontWeight: '700',     // Inter Bold
      letterSpacing: 0.0105, // px
      lineHeight: 18,        // px
      color: '#e4d4b5',
      textTransform: 'uppercase' as const,
    },
    
    endlessDescription: {
      fontSize: 12,          // px
      fontWeight: '500',     // Inter Medium
      letterSpacing: 0,      // px
      lineHeight: 16,        // px
      color: '#9ca3af',
    },
  },
  
  // Dimensions - exact pixel values from Figma
  dimensions: {
    // Header
    headerHeight: 56,
    backButtonHeight: 34,
    backButtonIconSize: 20,
    starIconSize: 14,
    statsSettingsButtonSize: 34,
    statsSettingsIconSize: 16,
    
    // Cards
    cardHeight: 73,          // px - Mission card height
    cardWidth: 369,          // px - Mission card width (in grid)
    cardContentHeight: 49,   // px - Card content area height
    
    // Level number
    levelNumberCircle: 48,   // px - Level number circle diameter
    levelNumberTextOffset: 18.13, // px - Level number text left offset
    
    // Stars
    starSize: 16,            // px - Star icon size
    starsGroupWidth: 52,     // px - Stars group width (3 stars + gaps)
    
    // Premium badge
    premiumBadgeWidth: 20,   // px - Premium badge width
    premiumBadgeHeight: 72,  // px - Premium badge height
    premiumBadgeInnerWidth: 18, // px - Premium badge inner width
    premiumBadgeInnerHeight: 68, // px - Premium badge inner height
    premiumBadgeTextWidth: 45,   // px - Premium badge text width (rotated)
    premiumBadgeTextHeight: 12,  // px - Premium badge text height
    
    // Endless card
    endlessCardHeight: 96,   // px
    endlessCardWidth: 768,   // px
    endlessIconContainer: 56, // px
    endlessIconInner: 32,    // px
    endlessImageWidth: 128,  // px
    endlessImageHeight: 96,  // px
    
    // Lock icon
    lockIconSize: 24,        // px - Lock icon size in locked overlay
    
    // Grid
    gridGap: 28,             // px - Gap between cards in grid
    gridColumns: 2,          // Number of columns
  },
  
  // Shadows - exact values from Figma
  shadows: {
    header: {
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    
    button: {
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    
    card: {
      shadowColor: 'rgba(0,0,0,0.4)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    
    levelNumber: {
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 3,
    },
    
    levelNumberText: {
      shadowColor: 'rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 2,
    },
    
    star: {
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 2,
    },
    
    premiumBadge: {
      shadowColor: 'rgba(0,0,0,0.3)',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    
    endlessCard: {
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 6,
    },
    
    headerTitle: {
      shadowColor: 'rgba(0,0,0,0.15)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  
  // Border radius - exact values from Figma
  borderRadius: {
    container: 14,          // px - Main container
    card: 14,               // px - Mission card
    button: 4,              // px - Buttons
    levelNumber: 16777200,  // px - Fully rounded (circle)
    premiumBadge: 13,       // px - Premium badge
    premiumBadgeTopRight: 13, // px
    premiumBadgeBottomRight: 13, // px
    endlessCard: 10,        // px - Endless card
    endlessIcon: 16777200, // px - Fully rounded (circle)
  },
  
  // Inset shadows (inner shadows) - from Figma
  insetShadows: {
    levelNumber: {
      shadowColor: 'rgba(255,255,255,0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 0, // Inset shadows don't work on mobile, use overlay
    },
    
    endlessCard: {
      shadowColor: 'rgba(160,85,40,0.3)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 0,
    },
  },
} as const;

/**
 * Helper function to convert Figma letter spacing to React Native format
 * Figma uses px, React Native uses number (multiplier of fontSize)
 */
export const figmaLetterSpacingToRN = (letterSpacing: number, fontSize: number): number => {
  if (!fontSize || fontSize === 0) return 0;
  const result = letterSpacing / fontSize;
  return isNaN(result) ? 0 : result;
};

/**
 * Helper function to get shadow style for React Native
 */
export const getShadowStyle = (shadowKey: keyof typeof CAMPAIGN_DESIGN_SPECS.shadows) => {
  return CAMPAIGN_DESIGN_SPECS.shadows[shadowKey];
};

