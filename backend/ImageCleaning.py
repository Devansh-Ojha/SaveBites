import cv2 as cv
import numpy as np
import sys, getopt

# takes a path to an image and returns the image, converted to grayscale, as numpy array  
def imageToGrayScale(input_path):
    img = cv.imread(input_path)
    return cv.cvtColor(img, cv.COLOR_BGR2GRAY)

def contrast(img): # input_path for consistency
    """"
    function option 1 of attempting to adjust contrast
    """
    
    # alpha = contrast, beta = brightness
    #alpha = 1.5 # (scale of 0.0 - 3.0)
    #eta = 0 # (scale of 0 - 100)

    _, thresh_image = cv.threshold(img, 150, 255, cv.THRESH_BINARY)


    # load enhanced image w/ new params, set to random var
    #enhanced_img = cv.convertScaleAbs(img, alpha = alpha, beta = beta)

    return thresh_image

def getImageAngle(img):
    """
    Takes in a black/white image and gets the approximate rotation angle to straighten it
    """
    lines = cv.HoughLines(img, rho=1, theta=np.pi/180.0, threshold=250)
    if lines is None:
        #if no lines detected
        return None
    tot = 0
    theta_avg = 0.0
    for line in lines:
        _, theta = line[0]
        if theta < np.pi/2:
            theta_avg += theta
            tot += 1
    if tot == 0:
        #avoids error
        return None
    theta_avg = theta_avg / tot
    return theta_avg
        
        

debug = False

def rotate_image(image, angle):
    image_center = tuple(np.array(image.shape[1::-1]) / 2)
    rotation_matrix = cv.getRotationMatrix2D(image_center, angle, 1.0)
    result = cv.warpAffine(image, rotation_matrix, image.shape[1::-1], flags=cv.INTER_LINEAR)
    return result


# def rotate_image(image, angle):
#     h, w = image.shape[:2]
#     image_center = (w / 2, h / 2)

#     otation_matrix = cv.getRotationMatrix2D(image_center, angle, 1.0)

#     # compute the new bounding dimensions of the image
#     abs_cos = abs(rotation_matrix[0, 0])
#     abs_sin = abs(rotation_matrix[0, 1])
#     bound_w = int(h * abs_sin + w * abs_cos)
#     bound_h = int(h * abs_cos + w * abs_sin)

#     # adjust the rotation matrix to consider translation
#     rotation_matrix[0, 2] += bound_w / 2 - image_center[0]
#     rotation_matrix[1, 2] += bound_h / 2 - image_center[1]

#     result = cv.warpAffine(image, rotation_matrix, (bound_w, bound_h))
#     return result

def straighten(infile, outfile):
    # load image file
    image1 = cv.imread(infile)

    ""
    width, height, _ = image1.shape

    if debug:
        image2 = image1.copy()
        if width > 2000:
            image2 = cv.resize(image2, (0, 0), fx = 0.15, fy = 0.15)

    if width > 2000:
        downsize = cv.resize(image1, (0, 0), fx = 0.15, fy = 0.15)
    else:
        downsize = image1
    ""

    gray = imageToGrayScale(infile) # convert image to greyscale
    
    # apply gaussian blur to reduce any noise
    # blur = cv.GaussianBlur(gray, (9, 9), 0)
    # if debug:
    #     cv.imwrite('blur.jpg', blur)

    # find the black/white threshold
    thresh = contrast(gray)

    # find the edges using Canny edge detection
    canny_image = thresh
    
    if debug:
        cv.imwrite('canny.jpg', canny_image)

    # find the lines that make up the edges
    lines = cv.HoughLines(canny_image, 1, np.pi / 180.0, 250, np.array([]))
    for line in lines:
        rho, theta = line[0]
        if debug:
            a = np.cos(theta)
            b = np.sin(theta)
            x0 = a * rho
            y0 = b * rho
            x1 = int(x0 + 1000 * (-b))
            y1 = int(y0 + 1000 * (a))
            x2 = int(x0 - 1000 * (-b))
            y2 = int(y0 - 1000 * (a))

            cv.line(image2, (x1, y1), (x2, y2), (0, 0, 255), 2) # originally was img2

    if debug:
        cv.imwrite('houghlines.jpg', image2) # originally was img2

    # rotate the image by the angle of the last line
    if theta > 1:
        image3 = rotate_image(thresh, 180 * theta / np.pi - 180)
    else:
        image3 = rotate_image(thresh, 180 * theta / np.pi)


    # write the rotated image to disk
    cv.imwrite(outfile, image3) # originally image3

def wsRotate(infile, outfile):
    img = imageToGrayScale(infile)
    img = contrast(img)
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    gray = cv.bitwise_not(gray)
    thresh = cv.threshold(gray, 0, 255,
	cv.THRESH_BINARY | cv.THRESH_OTSU)[1]
    # grab the (x, y) coordinates of all pixel values that
    # are greater than zero, then use these coordinates to
    # compute a rotated bounding box that contains all
    # coordinates
    coords = np.column_stack(np.where(thresh > 0))
    angle = cv.minAreaRect(coords)[-1]
    # the `cv2.minAreaRect` function returns values in the
    # range [-90, 0); as the rectangle rotates clockwise the
    # returned angle trends to 0 -- in this special case we
    # need to add 90 degrees to the angle
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = img.shape[:2]
    center = (w // 2, h // 2)
    M = cv.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv.warpAffine(img, M, (w, h),
	flags=cv.INTER_CUBIC, borderMode=cv.BORDER_REPLICATE)
    cv.putText(rotated, "Angle: {:.2f} degrees".format(angle),
	(10, 30), cv.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    cv.imwrite(outfile, img)

img_path = "test_images/test_image5.png"

#grayImage = contrast(imageToGrayScale(img_path)) 
# cv.imshow("Output", contrast(grayImage)) # contrast function test call

#cv.imshow("Output", grayImage)

# cv.imshow("Output", incContrast(img_path))

output_path = "test_images/test_output.png"
wsRotate(img_path, output_path)

# print(getImageAngle(grayImage))
cv.waitKey(0) 
cv.destroyAllWindows()

