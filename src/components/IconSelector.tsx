import React, { useState, useMemo } from 'react'
import { useTheme } from './ThemeProvider'
import { 
  FiSettings, FiHome, FiUser, FiSearch, FiPlus, FiEdit, FiTrash, FiDownload, FiUpload, FiLink,
  FiDatabase, FiBarChart, FiTrendingUp, FiTrendingDown, FiActivity, FiFilter, FiGrid, FiList,
  FiMail, FiMessageSquare, FiPhone, FiVideo, FiCamera, FiMic, FiShare, FiSend, FiBell, FiFlag,
  FiCode, FiTerminal, FiGitBranch, FiGitCommit, FiGitMerge, FiGitPullRequest, FiPackage, FiServer, FiCpu, FiHardDrive,
  FiBriefcase, FiCreditCard, FiDollarSign, FiShoppingCart, FiTruck, FiCalendar, FiClock, FiMapPin,
  FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume, FiVolumeX, FiMusic, FiImage, FiFile, FiFolder,
  FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight, FiMove, FiRotateCw,
  FiCheck, FiX, FiAlertCircle, FiAlertTriangle, FiInfo, FiHelpCircle, FiShield, FiLock, FiUnlock, FiEye
} from 'react-icons/fi'

interface IconSelectorProps {
  value: string
  onChange: (icon: string) => void
  placeholder?: string
}

// Define all available icons
const ALL_ICONS = [
  { name: 'Settings', icon: 'FiSettings', component: FiSettings },
  { name: 'Home', icon: 'FiHome', component: FiHome },
  { name: 'User', icon: 'FiUser', component: FiUser },
  { name: 'Search', icon: 'FiSearch', component: FiSearch },
  { name: 'Plus', icon: 'FiPlus', component: FiPlus },
  { name: 'Edit', icon: 'FiEdit', component: FiEdit },
  { name: 'Trash', icon: 'FiTrash', component: FiTrash },
  { name: 'Download', icon: 'FiDownload', component: FiDownload },
  { name: 'Upload', icon: 'FiUpload', component: FiUpload },
  { name: 'Link', icon: 'FiLink', component: FiLink },
  { name: 'Database', icon: 'FiDatabase', component: FiDatabase },
  { name: 'Bar Chart', icon: 'FiBarChart', component: FiBarChart },
  { name: 'Trending Up', icon: 'FiTrendingUp', component: FiTrendingUp },
  { name: 'Trending Down', icon: 'FiTrendingDown', component: FiTrendingDown },
  { name: 'Activity', icon: 'FiActivity', component: FiActivity },
  { name: 'Filter', icon: 'FiFilter', component: FiFilter },
  { name: 'Grid', icon: 'FiGrid', component: FiGrid },
  { name: 'List', icon: 'FiList', component: FiList },
  { name: 'Mail', icon: 'FiMail', component: FiMail },
  { name: 'Message', icon: 'FiMessageSquare', component: FiMessageSquare },
  { name: 'Phone', icon: 'FiPhone', component: FiPhone },
  { name: 'Video', icon: 'FiVideo', component: FiVideo },
  { name: 'Camera', icon: 'FiCamera', component: FiCamera },
  { name: 'Mic', icon: 'FiMic', component: FiMic },
  { name: 'Share', icon: 'FiShare', component: FiShare },
  { name: 'Send', icon: 'FiSend', component: FiSend },
  { name: 'Bell', icon: 'FiBell', component: FiBell },
  { name: 'Flag', icon: 'FiFlag', component: FiFlag },
  { name: 'Code', icon: 'FiCode', component: FiCode },
  { name: 'Terminal', icon: 'FiTerminal', component: FiTerminal },
  { name: 'Git Branch', icon: 'FiGitBranch', component: FiGitBranch },
  { name: 'Git Commit', icon: 'FiGitCommit', component: FiGitCommit },
  { name: 'Git Merge', icon: 'FiGitMerge', component: FiGitMerge },
  { name: 'Git Pull Request', icon: 'FiGitPullRequest', component: FiGitPullRequest },
  { name: 'Package', icon: 'FiPackage', component: FiPackage },
  { name: 'Server', icon: 'FiServer', component: FiServer },
  { name: 'Cpu', icon: 'FiCpu', component: FiCpu },
  { name: 'Hard Drive', icon: 'FiHardDrive', component: FiHardDrive },
  { name: 'Briefcase', icon: 'FiBriefcase', component: FiBriefcase },
  { name: 'Credit Card', icon: 'FiCreditCard', component: FiCreditCard },
  { name: 'Dollar Sign', icon: 'FiDollarSign', component: FiDollarSign },
  { name: 'Shopping Cart', icon: 'FiShoppingCart', component: FiShoppingCart },
  { name: 'Truck', icon: 'FiTruck', component: FiTruck },
  { name: 'Calendar', icon: 'FiCalendar', component: FiCalendar },
  { name: 'Clock', icon: 'FiClock', component: FiClock },
  { name: 'Map Pin', icon: 'FiMapPin', component: FiMapPin },
  { name: 'Play', icon: 'FiPlay', component: FiPlay },
  { name: 'Pause', icon: 'FiPause', component: FiPause },
  { name: 'Skip Back', icon: 'FiSkipBack', component: FiSkipBack },
  { name: 'Skip Forward', icon: 'FiSkipForward', component: FiSkipForward },
  { name: 'Volume', icon: 'FiVolume', component: FiVolume },
  { name: 'Volume X', icon: 'FiVolumeX', component: FiVolumeX },
  { name: 'Music', icon: 'FiMusic', component: FiMusic },
  { name: 'Image', icon: 'FiImage', component: FiImage },
  { name: 'File', icon: 'FiFile', component: FiFile },
  { name: 'Folder', icon: 'FiFolder', component: FiFolder },
  { name: 'Arrow Up', icon: 'FiArrowUp', component: FiArrowUp },
  { name: 'Arrow Down', icon: 'FiArrowDown', component: FiArrowDown },
  { name: 'Arrow Left', icon: 'FiArrowLeft', component: FiArrowLeft },
  { name: 'Arrow Right', icon: 'FiArrowRight', component: FiArrowRight },
  { name: 'Chevron Up', icon: 'FiChevronUp', component: FiChevronUp },
  { name: 'Chevron Down', icon: 'FiChevronDown', component: FiChevronDown },
  { name: 'Chevron Left', icon: 'FiChevronLeft', component: FiChevronLeft },
  { name: 'Chevron Right', icon: 'FiChevronRight', component: FiChevronRight },
  { name: 'Move', icon: 'FiMove', component: FiMove },
  { name: 'Rotate Cw', icon: 'FiRotateCw', component: FiRotateCw },
  { name: 'Check', icon: 'FiCheck', component: FiCheck },
  { name: 'X', icon: 'FiX', component: FiX },
  { name: 'Alert Circle', icon: 'FiAlertCircle', component: FiAlertCircle },
  { name: 'Alert Triangle', icon: 'FiAlertTriangle', component: FiAlertTriangle },
  { name: 'Info', icon: 'FiInfo', component: FiInfo },
  { name: 'Help Circle', icon: 'FiHelpCircle', component: FiHelpCircle },
  { name: 'Shield', icon: 'FiShield', component: FiShield },
  { name: 'Lock', icon: 'FiLock', component: FiLock },
  { name: 'Unlock', icon: 'FiUnlock', component: FiUnlock },
  { name: 'Eye', icon: 'FiEye', component: FiEye },
]

export const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select an icon..."
}) => {
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      return ALL_ICONS
    }
    
    return ALL_ICONS.filter(icon => 
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.icon.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  // Find current icon info
  const currentIcon = useMemo(() => {
    if (!value) return null
    
    // Check if it's a custom emoji
    if (value.length <= 2) return { name: 'Custom', icon: value, component: null }
    
    // Check if it's a React Icon
    return ALL_ICONS.find(icon => icon.icon === value) || null
  }, [value])

  const handleIconSelect = (icon: { name: string; icon: string; component: any }) => {
    onChange(icon.icon)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white hover:border-blue-500 hover:bg-gray-700' 
            : 'bg-white border-gray-300 text-gray-900 hover:border-blue-500 hover:bg-gray-50'
        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      >
        <div className="flex items-center space-x-3">
          {currentIcon ? (
            <>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {currentIcon.component ? (
                  <currentIcon.component className="w-4 h-4" />
                ) : (
                  <span className="text-lg">{currentIcon.icon}</span>
                )}
              </div>
              <span className="font-small text-sm">{currentIcon.name}</span>
            </>
          ) : (
            <>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <FiSearch className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-500">{placeholder}</span>
            </>
          )}
        </div>
        <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border-2 shadow-2xl min-w-[400px] backdrop-blur-sm ${
          isDark 
            ? 'bg-gray-800/95 border-gray-600' 
            : 'bg-white/95 border-gray-200'
        }`}>
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Select Icon
              </h3>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {filteredIcons.length} icons available
              </span>
            </div>
            
            {/* Search */}
            <div className="relative">
              <FiSearch className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search icons by name..."
                className={`w-full pl-8 pr-3 py-2 rounded-lg border-2 text-sm transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20`}
                autoFocus
              />
            </div>
          </div>

          {/* Icons Grid */}
          <div className="max-h-64 overflow-y-auto">
            {filteredIcons.length > 0 ? (
              <div className="p-2">
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                  {filteredIcons.map((icon) => (
                    <button
                      key={icon.icon}
                      onClick={() => handleIconSelect(icon)}
                      className={`group p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-110 ${
                        isDark 
                          ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                          : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      } hover:shadow-md border border-transparent hover:border-blue-200 dark:hover:border-blue-800`}
                      title={icon.name}
                    >
                      <icon.component className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">No icons found matching "{searchTerm}"</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}