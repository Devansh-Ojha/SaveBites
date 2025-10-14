import cv2 as cv
from deskew import determine_skew
from skimage.transform import rotate

img_path = "test_images/test_image5.png"

# takes a path to an image and returns the image, converted to grayscale, as numpy array  
def imageToGrayScale(input_path):
    img = cv.imread(input_path)
    return cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# takes an image and adjusts the contrast for readability
def contrast(img):
    _, thresh_image = cv.threshold(img, 150, 255, cv.THRESH_BINARY)
    return thresh_image

# takes a path to an image, converts it to grayscale and increases contrast, then returns deskewed image
def unskew(infile):
    clean_image = contrast(imageToGrayScale(infile))
    angle = determine_skew(clean_image)
    rotated = rotate(clean_image, angle, resize=True) * 255
    return rotated

cv.waitKey(0) 