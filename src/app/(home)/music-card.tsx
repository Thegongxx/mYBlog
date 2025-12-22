'use client'

import { useState, useRef, useEffect } from 'react'
import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from './stores/config-store'
import { CARD_SPACING } from '@/consts'
import MusicSVG from '@/svgs/music.svg'
import PlaySVG from '@/svgs/play.svg'
import { HomeDraggableLayer } from './home-draggable-layer'
import { Pause } from 'lucide-react'

// 1. 修改音乐文件路径：确保文件放在 public/music/ 文件夹下
const MUSIC_FILES = ['/music/christmas.m4a'] 

export default function MusicCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const styles = cardStyles.musicCard
	const hiCardStyles = cardStyles.hiCard
	const clockCardStyles = cardStyles.clockCard
	const calendarCardStyles = cardStyles.calendarCard

	// 2. 默认打开：将初始值设为 true
	const [isPlaying, setIsPlaying] = useState(true)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [progress, setProgress] = useState(0)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const currentIndexRef = useRef(0)

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + CARD_SPACING + hiCardStyles.width / 2 - styles.offset
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - clockCardStyles.offset + CARD_SPACING + calendarCardStyles.height + CARD_SPACING

	// 初始化音频逻辑
	useEffect(() => {
		// 关键点：只在浏览器环境下创建 Audio 对象，防止 SSR 构建报错
		if (typeof window !== 'undefined' && !audioRef.current) {
			audioRef.current = new Audio()
		}

		const audio = audioRef.current
		if (!audio) return

		const updateProgress = () => {
			if (audio.duration) {
				setProgress((audio.currentTime / audio.duration) * 100)
			}
		}

		const handleEnded = () => {
			const nextIndex = (currentIndexRef.current + 1) % MUSIC_FILES.length
			currentIndexRef.current = nextIndex
			setCurrentIndex(nextIndex)
			setProgress(0)
		}

		const handleLoadedMetadata = () => {
			updateProgress()
			// 如果默认是播放状态，尝试在加载后播放
			if (isPlaying) {
				audio.play().catch(() => {
					console.log('等待用户交互后播放')
					setIsPlaying(false) // 被浏览器拦截则显示暂停状态
				})
			}
		}

		audio.addEventListener('timeupdate', updateProgress)
		audio.addEventListener('ended', handleEnded)
		audio.addEventListener('loadedmetadata', handleLoadedMetadata)

		return () => {
			audio.removeEventListener('timeupdate', updateProgress)
			audio.removeEventListener('ended', handleEnded)
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
		}
	}, [])

	// 处理切歌
	useEffect(() => {
		currentIndexRef.current = currentIndex
		if (audioRef.current) {
			audioRef.current.pause()
			audioRef.current.src = MUSIC_FILES[currentIndex]
			setProgress(0)
			if (isPlaying) {
				audioRef.current.play().catch(() => {})
			}
		}
	}, [currentIndex])

	// 处理播放暂停切换
	useEffect(() => {
		if (!audioRef.current) return
		if (isPlaying) {
			audioRef.current.play().catch(() => {})
		} else {
			audioRef.current.pause()
		}
	}, [isPlaying])

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying)
	}

	return (
		<HomeDraggableLayer cardKey='musicCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='flex items-center gap-3'>
				{siteContent.enableChristmas && (
					<>
						<img
							src='/images/christmas/snow-10.webp'
							alt='decoration'
							className='pointer-events-none absolute'
							style={{ width: 120, left: -8, top: -12, opacity: 0.8 }}
						/>
						<img
							src='/images/christmas/snow-11.webp'
							alt='decoration'
							className='pointer-events-none absolute'
							style={{ width: 80, right: -10, top: -12, opacity: 0.8 }}
						/>
					</>
				)}

				<MusicSVG className='h-8 w-8' />

				<div className='flex-1'>
					{/* 修复了原代码中的文本标签未闭合问题 */}
					<div className='text-secondary text-sm'>Merry Christmas</div>

					<div className='mt-1 h-2 rounded-full bg-white/60'>
						<div className='bg-linear h-full rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
					</div>
				</div>

				<button onClick={togglePlayPause} className='flex h-10 w-10 items-center justify-center rounded-full bg-white transition-opacity hover:opacity-80'>
					{isPlaying ? <Pause className='text-brand h-4 w-4' /> : <PlaySVG className='text-brand ml-1 h-4 w-4' />}
				</button>
			</Card>
		</HomeDraggableLayer>
	)
}
