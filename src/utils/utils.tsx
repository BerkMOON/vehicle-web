export const getCodeFromUrl = () => {
  const url = window.location.href
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('code') || ''
  } catch (error) {
    console.error('解析URL失败:', error)
    return ''
  }
}