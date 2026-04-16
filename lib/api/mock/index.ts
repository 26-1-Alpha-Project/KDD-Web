/** Mock API 호출 시 네트워크 지연을 시뮬레이션하는 유틸리티 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
