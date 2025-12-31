'use client'

import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from './stores/config-store'
import { CARD_SPACING } from '@/consts'
import { HomeDraggableLayer } from './home-draggable-layer'
import Card from '@/components/card'

export default function MusicCard() {
  const center = useCenterStore()
  const { cardStyles, siteContent } = useConfigStore()
  const styles = cardStyles.musicCard
  const hiCardStyles = cardStyles.hiCard
  const clockCardStyles = cardStyles.clockCard
  const calendarCardStyles = cardStyles.calendarCard

  const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + CARD_SPACING + hiCardStyles.width / 2 - styles.offset
  const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - clockCardStyles.offset + CARD_SPACING + calendarCardStyles.height + CARD_SPACING

  // Bilibili 视频嵌入链接（已去掉 //，React 中建议用 https）
  const bilibiliSrc = "https://player.bilibili.com/player.html?isOutside=true&aid=114982767300486&bvid=BV1TMtKzJEgB&cid=31531140595&p=1"

  return (
    <HomeDraggableLayer cardKey='musicCard' x={x} y={y} width={styles.width} height={styles.height}>
      <Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='relative overflow-hidden p-0'>
        {/* 圣诞装饰保留 */}
        {siteContent.enableChristmas && (
          <>
            <img
              src='/images/christmas/snow-10.webp'
              alt='Christmas decoration'
              className='pointer-events-none absolute z-10'
              style={{ width: 120, left: -8, top: -12, opacity: 0.8 }}
            />
            <img
              src='/images/christmas/snow-11.webp'
              alt='Christmas decoration'
              className='pointer-events-none absolute z-10'
              style={{ width: 80, right: -10, top: -12, opacity: 0.8 }}
            />
          </>
        )}

        {/* 嵌入 Bilibili 视频 */}
        <iframe
          src={bilibiliSrc}
          scrolling="no"
          border="0"
          frameBorder="no"
          framespacing="0"
          allowFullScreen={true}
          className="absolute inset-0 w-full h-full"
          title="Bilibili Video Player"
        />

        {/* 可选：添加一个标题遮罩层 */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-3 pointer-events-none z-20">
          <p className="text-white text-sm font-medium">Merry Christmas 🎵</p>
        </div>
      </Card>
    </HomeDraggableLayer>
  )
}
