import {memo, useEffect, useMemo, useRef, useState} from 'react';
import {useDropzone} from "react-dropzone";
import {
    ReactCrop,
    centerCrop,
    makeAspectCrop,
    convertToPixelCrop
} from "react-image-crop";
import classNames from "classnames";

import {Modal} from "shared/ui/modal";
import {Button} from "shared/ui/button";
import {Input} from "shared/ui/input";
import {useDebounceEffect} from "shared/lib/hooks/useDebounceEffect";

import cls from "./imageCrop.module.sass";
import 'react-image-crop/dist/ReactCrop.css'


export const ImageCrop = memo((props) => {

    const {
        setActive,
        active,
        currentImage,
        setNewImage
    } = props


    function centerAspectCrop(
        mediaWidth,
        mediaHeight,
        aspect,
    ) {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight,
            ),
            mediaWidth,
            mediaHeight,
        )
    }

    useEffect(() => {
        setImgSrc(currentImage)
    }, [currentImage])


    const [completedCrop, setCompletedCrop] = useState()
    const [aspect, setAspect] = useState(null)
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [imgSrc, setImgSrc] = useState(currentImage)
    const imgRef = useRef(null)
    const previewCanvasRef = useRef(null)




    function onImageLoad(e) {
        if (aspect) {
            const {width, height} = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }


    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                await canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    // useEffect(() => {
    //     if (aspect) {
    //         if (imgRef.current) {
    //             const {width, height} = imgRef.current
    //             const newCrop = centerAspectCrop(width, height, 16 / 9)
    //             setCrop(newCrop)
    //             setCompletedCrop(convertToPixelCrop(newCrop, width, height))
    //         }
    //     }
    // }, [aspect])

    const [crop, setCrop] = useState()

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: acceptedFiles => {
            // console.log(acceptedFiles[0], "res2")
            setImgSrc(acceptedFiles[0])
        }
    })

    async function onDownloadCropClick() {
        const image = imgRef.current
        const previewCanvas = previewCanvasRef.current
        if (!image || !previewCanvas || !completedCrop) {
            // throw new Error('Crop canvas does not exist')
            setNewImage(imgSrc)
            setScale(1)
            setRotate(0)
            setImgSrc(null)
            setActive(false)
            return null
        }

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const offscreen = new OffscreenCanvas(
            completedCrop?.width * scaleX,
            completedCrop?.height * scaleY,
        )
        const ctx = offscreen.getContext('2d')
        if (!ctx) {
            throw new Error('No 2d context')
        }

        if (!offscreen.width && !offscreen.height) {
            setNewImage(imgSrc)
            setScale(1)
            setRotate(0)
            setImgSrc(null)
            setActive(false)
            return null
        }

        ctx.drawImage(
            previewCanvas,
            0,
            0,
            previewCanvas.width,
            previewCanvas.height,
            0,
            0,
            offscreen.width,
            offscreen.height,
        )

        const blob = await offscreen.convertToBlob({
            type: 'image/png',
        })

        const res = new File([blob], "userImg.png", {
            type: "image/png"
        })

        // console.log(res,"res")

        // setImgSrc(URL.createObjectURL(res))
        setNewImage(res)
        setScale(1)
        setRotate(0)
        setImgSrc(null)
        setActive(false)
    }

    const onClear = () => {
        setScale(1)
        setRotate(0)
        setImgSrc(null)
    }

    const imageStyle = useMemo(() => ({
        transform: `scale(${scale}) rotate(${rotate}deg)`
    }), [scale, rotate])




    return (
        <Modal
            setActive={setActive}
            active={active}
        >
            <div
                className={cls.changeImage}
            >
                <h1>Rasm o'zgartirish</h1>
                <div
                    className={cls.changeImage__inner}
                >
                    <Input
                        name={"scale-input"}
                        extraValues={{step: "0.1"}}
                        extraClassName={cls.changeImage__input}
                        title={"Rasm masshtabini ozgartirish"}
                        type={"number"}
                        defaultValue={scale}
                        onChange={e => setScale(e.target.value)}
                        disabled={!imgSrc?.path}
                    />
                    <Input
                        name={"rotate-input"}
                        extraClassName={cls.changeImage__input}
                        title={"Rasm aylantirish"}
                        type={"number"}
                        defaultValue={rotate}
                        onChange={e => setRotate(e.target.value)}
                        disabled={!imgSrc?.path}
                    />
                    <div className={cls.changeImage__dropzone}>
                        {(!imgSrc?.path || !imgSrc) && (
                            <div
                                {...getRootProps()}
                                className={classNames(cls.changeImage__drop, {
                                    [cls.notImage]: !imgSrc?.path
                                })}
                            >
                                <input
                                    {...getInputProps()}
                                    type="file"
                                />
                                <i className={classNames("far fa-images", cls.changeImage__icon)}/>
                            </div>
                        )}
                        {(!!imgSrc?.path) && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                                minHeight={100}
                            >
                                <img
                                    className={cls.changeImage__img}
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={
                                        !!imgSrc ? typeof imgSrc === "string" ? imgSrc :
                                            URL.createObjectURL(imgSrc) : null
                                    }
                                    style={imageStyle}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        )}
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                border: '1px solid black',
                                objectFit: 'contain',
                                width: completedCrop?.width,
                                height: completedCrop?.height,
                                visibility: "hidden",
                                display: "none"
                            }}
                        />
                    </div>

                    <div className={cls.changeImage__btns}>
                        <Button onClick={onDownloadCropClick}>O'zgartirish</Button>
                        <Button onClick={onClear}>Tozalash</Button>
                    </div>


                </div>
            </div>
        </Modal>
    )
})

const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
    image,
    canvas,
    crop,
    scale = 1,
    rotate = 0,
) {

    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    const rotateRads = rotate * TO_RADIANS
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    ctx.translate(-cropX, -cropY)
    ctx.translate(centerX, centerY)
    ctx.rotate(rotateRads)
    ctx.scale(scale, scale)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )

    ctx.restore()
}



