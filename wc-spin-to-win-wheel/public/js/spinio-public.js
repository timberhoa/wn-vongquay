function Spin2WinWheel() {
  var audiofile = spinio.pluginsUrl;
  var xmlns = "http://www.w3.org/2000/svg",
    xlinkns = "http://www.w3.org/1999/xlink",
    select = function(s) {
      return document.querySelector(s);
    },
    selectAll = function(s) {
      return document.querySelectorAll(s);
    },
    thisWheel = this,
    wheelSVG = select('.wheelSVG'),
    wheel = select('.wheel'),
    wheelOutline = select('.wheelOutline'),
    wheelContainer = select('.wheelContainer'),
    peg = select('.peg'),
    pegContainer = select('.pegContainer'),
    mainContainer = select('.mainContainer'),
    valueContainer = select('.valueContainer'),
    centerCircle = select('.centerCircle'),
    toast = select('.toast'),
    toastText = select('.toast p'),
    dataObj,
    svgWidth,
    svgHeight,
    wheelStrokeColor,
    wheelStrokeWidth,
    wheelFillColor = 'transparent',
    wheelSize,
    wheelRadius,
    wheelTextColor,
    wheelTextOffsetY,
    wheelImageOffsetY,
    wheelTextSize,
    wheelImageSize,
    wheelDragger,
    currentWheelRoation,
    centerCircleStrokeColor,
    centerCircleStrokeWidth,
    centerCircleFillColor,
    centerCircleSize,
    centerCircleRadius,
    segmentStrokeColor,
    segmentStrokeWidth,
    segmentValuesArray,
    numSegments,
    numSpins,
    rotationStep,
    segmentStep,
    oldWheelPos,
    currentWheelPos = 0,
    centerX,
    centerY,
    colorArray,
    spinCount = 0,
    spinMultiplier = 2,
    colorCount = 0,
    startAngle = 0,
    endAngle = startAngle,
    segmentArray = [],
    minSpinDuration,
    gameOverText,
    invalidSpinText,
    introText,
    gameId,
    hasSound,
    hasShadows,
    clickToSpin,
    spinButton = null,
    onResult,
    onGameEnd,
    onError,
    spinVelocityTracker,
    gameResultsArray = [],
    pegSnd = new Audio(spinio.pluginsUrl+'media/wheel_tick.mp3'),
    spinDestinationArray,
    randomSpins = true,
    numRevsPerDestination = 3 * 360,
    invalidSpinThreshold = 0.5,
    probabilityArray = null,
    hasProbability = false,
    requiredProb,
    initError1 = "Invalid destination set - please ensure the destination in spinDestinationArray is greater than 0 and less than or equal to the number of segments",
    initError2 = "Not enough segments. Please add more entries to segmentValuesArray",
    probabilityErrorStr = "If you have set JSON probability values they must add up to 100",
    setInitData = function() {

      wheelStrokeColor = dataObj.wheelStrokeColor;
      wheelSize = dataObj.wheelSize;
      wheelRadius = wheelSize / 2;
      wheelTextColor = dataObj.wheelTextColor;
      wheelStrokeColor = dataObj.wheelStrokeColor;
      wheelStrokeWidth = dataObj.wheelStrokeWidth;
      wheelTextOffsetY = dataObj.wheelTextOffsetY;
      wheelImageOffsetY = dataObj.wheelImageOffsetY;
      wheelImageSize = dataObj.wheelImageSize;
      wheelTextSize = dataObj.wheelTextSize;
      centerCircleStrokeColor = dataObj.centerCircleStrokeColor;
      centerCircleStrokeWidth = dataObj.centerCircleStrokeWidth;
      centerCircleFillColor = dataObj.centerCircleFillColor;
      centerCircleSize = dataObj.centerCircleSize;
      centerCircleRadius = centerCircleSize / 2;
      segmentStrokeColor = dataObj.segmentStrokeColor;
      segmentStrokeWidth = dataObj.segmentStrokeWidth;
      segmentValuesArray = dataObj.segmentValuesArray;
      numSegments = segmentValuesArray.length;
      numSpins = (dataObj.numSpins == -1) ? 9999999999999999 : parseInt(dataObj.numSpins);
      minSpinDuration = dataObj.minSpinDuration;
      gameOverText = dataObj.gameOverText;
      invalidSpinText = dataObj.invalidSpinText;
      introText = dataObj.introText;
      hasSound = dataObj.hasSound;
      gameId = dataObj.gameId;
      clickToSpin = dataObj.clickToSpin;
      rotationStep = 360 / numSegments;
      segmentStep = rotationStep / 2;
      centerX = dataObj.centerX;
      centerY = dataObj.centerY;
      colorArray = dataObj.colorArray;
      hasShadows = dataObj.hasShadows;
      spinDestinationArray = dataObj.spinDestinationArray;
      if (hasShadows) {
        wheelOutline.setAttributeNS(null, 'filter', 'url(#shadow)');
        valueContainer.setAttributeNS(null, 'filter', 'url(#shadow)');
        centerCircle.setAttributeNS(null, 'filter', 'url(#shadow)');
        pegContainer.setAttributeNS(null, 'filter', 'url(#shadow)');
        toast.style.boxShadow = "0px 0px 20px rgba(21,21,21,0.5)";
      }
    },
    setInitPos = function() {

      TweenMax.set('svg', {
        visibility: 'visible'
      })
      TweenMax.set(wheel, {
        svgOrigin: centerX + ' ' + centerY,
        x: 0,
        y: 0
      })
      TweenMax.set(peg, {
        x: centerX - (peg.getBBox().width / 2),
        y: centerY - wheelRadius - (peg.getBBox().height / 2),
        transformOrigin: '50% 25%',
        visibility: 'visible'
      })
      TweenMax.set(pegContainer, {
        transformOrigin: '50% 100%',
        scale: wheelSize / 600
      })

      TweenMax.set(mainContainer, {
        svgOrigin: centerX + ' ' + centerY,
        rotation: -90,
        x: 0,
        y: 0
      })

      TweenMax.set([toast], {
        xPercent: -50,
        left: '50%'//,
        //top: '50%',
        //yPercent: -50
      })

      TweenMax.set('svg', {
        xPercent: -50,
        left: '50%'//,
        //top: '50%',
        //yPercent: -50
      })

    },
    setSpinDestinations = function() {

      //console.log(dataObj.numSpins)
      if(numSpins == 0){

        showInitError('numSpins MUST BE GREATER THAN 0')
        return;
      }

      if(hasProbability){

        return;
      }


      if (spinDestinationArray.length > 0) {

        randomSpins = false;
        numSpins = spinDestinationArray.length;
        for (var i = 0; i < spinDestinationArray.length; i++) {
          //check to see if the destination is available (if you set the destination to be more than the number of segments this will catch that)
          if (spinDestinationArray[i] > numSegments || spinDestinationArray[i] === 0) {
            showInitError(initError1);

            toast.style.backgroundColor = 'red';
            return;
          }
          //make it zero based - this allows the author to set destinations using 1 as the first one (UX FTW!)
          spinDestinationArray[i] = spinDestinationArray[i] - 1;
          //ensure there is at least 2 spin revolutions (360 2 = 720) between destination spins
          spinDestinationArray[i] = ((spinDestinationArray[i] * -1) * rotationStep) - (numRevsPerDestination * spinMultiplier);
          //this multiplier increments to ensure the destination segment is indeed further around
          spinMultiplier += 2;
        }

      } else {

        //no else
      }

      //console.log(spinDestinationArray)

      if(clickToSpin){
        createClickToSpin();
      } else{
        createDraggable();
      }
      
      showIntroText();
    },
    randomBetween = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    // vẽ các phân đoạn trên bánh xe.
    drawSegments = function() {
      var x1, x2, y1, y2, d, p, g, t, tn, destFill;
      for (var i = 0; i < numSegments; i++) {
        //startAngle = endAngle;
        startAngle = -segmentStep;
        endAngle = startAngle + rotationStep;

        x1 = (centerX + wheelRadius * Math.cos(Math.PI * startAngle / 180));
        y1 = (centerY + wheelRadius * Math.sin(Math.PI * startAngle / 180));
        x2 = (centerX + wheelRadius * Math.cos(Math.PI * endAngle / 180));
        y2 = (centerY + wheelRadius * Math.sin(Math.PI * endAngle / 180));

        d = "M" + centerX + "," + centerY + "  L" + x1 + "," + y1 + "  A" + wheelRadius + "," + wheelRadius + " 0 0,1 " + x2 + "," + y2 + "z";

        g = document.createElementNS(xmlns, 'g');
        p = document.createElementNS(xmlns, 'path');
        g.appendChild(p);
        //g.appendChild(t);
        wheel.appendChild(g);
        TweenMax.set(p, {
          rotation: (i * rotationStep),
          svgOrigin: centerX + ' ' + centerY
        })
        p.setAttributeNS(null, 'd', d);

        //check if there are enough colors in the array to support the numer of segments
        if (colorArray[i]) {
          destFill = colorArray[i];
        } else {
          destFill = colorArray[colorCount];
          colorCount++;
          //if the extra color cycle count gets bigger than the number of listed colors set it back to 0 and start using them from the start (repeat the colors)
          if (colorCount == colorArray.length) {
            colorCount = 0;
          }
        }

        p.setAttributeNS(null, "fill", destFill);
        p.setAttributeNS(null, "stroke", 0);
        segmentArray.push({
          path: p,
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2
        });

      } //end for

      if (segmentStrokeWidth > 0) {
        drawSegmentStrokes()
      }

      addValues()

    },
     //vẽ các đường kẻ giữa các phân đoạn trên bánh xe.
    drawSegmentStrokes = function() {

      for (var i = 0; i < numSegments; i++) {

        var l = document.createElementNS(xmlns, 'line');  
        l.setAttributeNS(null, 'x1', centerX);
        l.setAttributeNS(null, 'x2', segmentArray[i].x2);
        l.setAttributeNS(null, 'y1', centerY);
        l.setAttributeNS(null, 'y2', segmentArray[i].y2);
        l.setAttributeNS(null, 'stroke', segmentStrokeColor);
        l.setAttributeNS(null, 'stroke-width', segmentStrokeWidth);
        wheel.appendChild(l);

        TweenMax.set(l, {
          svgOrigin: centerX + ' ' + centerY,
          rotation: (i * rotationStep)
        })
      }

    },
    //thêm các giá trị hoặc hình ảnh vào từng phân đoạn trên bánh xe.
    addValues = function() {

      for (var i = 0; i < numSegments; i++) {

        var g = document.createElementNS(xmlns, 'g');
        //var c = document.createElementNS(xmlns, 'circle');
        if (segmentValuesArray[i].type == "image") {

          var ig = document.createElementNS(xmlns, 'image');
          g.appendChild(ig);
          ig.setAttribute('class', 'wheelImage');
          ig.setAttributeNS(null, 'x', centerX - (wheelImageSize / 2));
          ig.setAttributeNS(null, 'y', centerY - wheelRadius + wheelImageOffsetY);
          ig.setAttributeNS(null, 'width', wheelImageSize);
          ig.setAttributeNS(null, 'height', wheelImageSize);
          ig.setAttributeNS(xlinkns, 'xlink:href', segmentValuesArray[i].value);
        } else if (segmentValuesArray[i].type == "string") {

          var t = document.createElementNS(xmlns, 'text');

          var lines = segmentValuesArray[i].value.split('^'), tn, ts;

          lines.forEach(function (value,index) {
              tn = document.createTextNode(value);
              ts = document.createElementNS(xmlns, "tspan");

              ts.setAttributeNS(null,'dy',  (index) ? "1.2em" : 0);

              ts.setAttributeNS(null,'x',centerX);

              ts.setAttributeNS(null,'text-anchor','middle');

              ts.appendChild(tn);

              t.appendChild(ts);
          });

          g.appendChild(t);
          t.setAttribute('class', 'wheelText');
          t.setAttributeNS(null, 'fill', wheelTextColor);
          t.setAttributeNS(null, 'x', centerX);
          t.setAttributeNS(null, 'y', centerY - wheelRadius + wheelTextOffsetY);
          t.style.fontSize = wheelTextSize;
        }

        valueContainer.appendChild(g)

        TweenMax.set(g, {
          svgOrigin: centerX + ' ' + centerY,
          rotation: i * rotationStep
        })

      }

      TweenMax.set(valueContainer, {
        svgOrigin: centerX + ' ' + centerY
      })

    },
     //rả về một phần tử <g> đại diện cho bánh xe
    getWheel = function() {

      var g = document.createElementNS(xmlns, 'g');
      var c = document.createElementNS(xmlns, 'circle');
      wheelOutline.appendChild(g);

      //wheel's outline
      c.setAttributeNS(null, 'fill', wheelFillColor);
      c.setAttributeNS(null, 'stroke', wheelStrokeColor);
      c.setAttributeNS(null, 'stroke-width', wheelStrokeWidth);
      c.setAttributeNS(null, 'cx', centerX);
      c.setAttributeNS(null, 'cy', centerY);
      c.setAttributeNS(null, 'r', wheelRadius);
      g.appendChild(c);

      return g;
    },
        //trả về một phần tử <circle> đại diện cho hình tròn ở trung tâm bánh xe. 
    getCenterCircle = function() {

      var c = document.createElementNS(xmlns, 'circle');

      //circle's outline
      c.setAttributeNS(null, 'fill', centerCircleFillColor);
      c.setAttributeNS(null, 'stroke', centerCircleStrokeColor);
      c.setAttributeNS(null, 'stroke-width', centerCircleStrokeWidth);
      c.setAttributeNS(null, 'cx', centerX);
      c.setAttributeNS(null, 'cy', centerY);
      c.setAttributeNS(null, 'r', centerCircleRadius);

      return c;
    },
        // sử dụng để chạy âm thanh khi tweener của trục được bắt đầu.
    onPegTweenStart = function() {
      pegSnd.play();
    },
        // khi người dùng nhấp vào bánh xe. ẩn thông báo
    onWheelPress = function() {
      // popup.style.visibility = 'hidden';
      toast.style.visibility = 'hidden';

    },  
        // khi người dùng nhấp vào nút quay.  
    onButtonPress = function() {
      
      toast.style.visibility = 'hidden';
      spinButton.onclick = null;
      spinMultiplier +=2;

    },
        //khi quá trình kéo bánh xe kết thúc
    onWheelDragEnd = function() {
      disableWheel();
      //prevent players dragging and dropping the wheel onto a segment
      if (randomSpins) {
        spinVelocityTracker = VelocityTracker.track(wheel, "rotation");
      }
    },
     //cập nhật trạng thái của vòng quay và các phần tử liên quan trong quá trình quay. 
    throwUpdate = function(e) {
      //this deals with the peg ticker (at the top) and decides which direction it should flick
      //personally I think this is a nice touch - hope you do too!
      oldWheelPos = currentWheelPos;

      currentWheelPos = Math.round(wheel._gsTransform.rotation / rotationStep);
      //peg code only
      if (currentWheelPos != oldWheelPos) {

        var rotation = (currentWheelPos > oldWheelPos) ? -35 : 35;

        TweenMax.fromTo(peg, 0.2, {

          rotation: rotation
        }, {
          onStart: (hasSound) ? onPegTweenStart : null,
          rotation: 0,
          ease: Back.easeOut
        })
      }
      //keep the values (images. text) sync'd with the wheel spinning
      TweenMax.set(valueContainer, {
        rotation: wheel._gsTransform.rotation
      })
    },
    //gọi khi quá trình quay kết thúc. 
    throwComplete = function() {

      //work out where the wheel lands
      currentWheelRoation = wheel._gsTransform.rotation;
      var normalizedRotation = Math.round(currentWheelRoation % 360);
      normalizedRotation = (normalizedRotation > 0) ? 360 - normalizedRotation : normalizedRotation;

      normalizedRotation = (normalizedRotation < 0) ? normalizedRotation *= -1 : normalizedRotation;     
            
      //check to see if spinVelocityTracker exists (only when randomSpins = true)
      if (spinVelocityTracker && spinVelocityTracker.getVelocity('rotation') <= invalidSpinThreshold) {

        enableWheel();        
        showResult('invalidSpin');        
        return;
        
      }



      var segId = Math.round(normalizedRotation / rotationStep);
      var winningSegment = segmentArray[segId].path;

      //console.log(Math.abs(segId), segId, Number(segId))
      //setResultText(Math.abs(segId));
      showResult(Math.abs(segId));
      

      //console.log(spinVelocityTracker.getVelocity('rotation'))
      //randomSpins is true if no destinations have been set
      if (randomSpins) {
        //this means no destinations have been set        
        if (numSpins > -1) {
          //this means no destinations have been set AND numSpins has been set to a positive number          
          spinCount++;
        } else {
          //this means no destinations have been set AND numSpins is -1 meaning you can spin randomly forever
          //so stop executing anything else
          return;
        }
      } else {
        //this means destinations have been set
        spinCount++;
        wheelDragger[0].vars.snap = [spinDestinationArray[spinCount]];
      }

      VelocityTracker.untrack(wheel);

      if (spinCount >= numSpins) {
        endGame();
        return;
      }

      enableWheel();

    },
    updateWheelBounds = function(){
      
      if(clickToSpin)return;
      
      wheelDragger[0].applyBounds({
        minRotation: -9999999999999999,
        maxRotation: currentWheelRoation
      });      
    },  
     //cập nhật ranh giới quay của bánh xe.  nhấp để quay
    getRandomSpinFunction = function(multiplier) {
      var f = function(endValue) {
        //console.log(endValue)
        return (Math.round((endValue / rotationStep)) * rotationStep) - multiplier
      }
      return f;
    },
    
     //tạo ra khả năng kéo thả cho vòng quay.
    createDraggable = function() {
      wheelDragger = Draggable.create(wheel, {
        type: 'rotation',
        bounds: {
          minRotation: -9999999999999999,
          maxRotation: 0
        },
        throwProps: true,
        ease: Back.easeOut.config(0.2),
        snap: (randomSpins) ?  getRandomSpinFunction(0) : [spinDestinationArray[spinCount]],
        throwResistance: 0,
        minDuration: minSpinDuration,        
        onThrowComplete: throwComplete,
        onPress: onWheelPress,
        onDrag: throwUpdate,
        onThrowUpdate: throwUpdate,
        overshootTolerance: 1,
        onDragEnd: onWheelDragEnd

      })
    },
//kiểm tra xem có xác suất (probability) được cung cấp cho các phần tử trong mảng segmentValuesArray không.
    checkHasProbability = function(){
      
      hasProbability = true;
      segmentValuesArray.forEach( function(el, val){
        //console.log(!isNaN(el.probability))
        //if(!el.probability){
        if(isNaN(el.probability)){

          hasProbability = false;
          //return false;

        } 
      })

      if(hasProbability){

        spinDestinationArray = [];//, numSpins)
        numSpins = (dataObj.numSpins == -1) ? 9999999999999999 : parseInt(dataObj.numSpins);
        //console.log( numSpins)
        checkProbabilityValues();
        
      }
      //return true;

    },
//kiểm tra tổng xác suất của tất cả các phần tử trong segmentValuesArray. 
    checkProbabilityValues = function(){


      var totalProb = 0;//, requiredProb = 100;


      segmentValuesArray.forEach( function(el, val){
        totalProb += el.probability;
      })

      requiredProb = totalProb;


      if(Math.ceil(totalProb) == requiredProb || Math.floor(totalProb) == requiredProb){

        createProbabilityArray();

      } else {

        var r = confirm("Total probability: " + totalProb + ' - ' +probabilityErrorStr);
        if (r == true) {
        TweenMax.set(wheelContainer, {
          autoAlpha:0
        })
        TweenMax.set(wheelContainer, {
          autoAlpha:0
        })
           
        }       
       
        
      }



    }
//tạo một mảng xác suất dựa trên trường probability của các phần tử trong mảng segmentValuesArray.
createProbabilityArray = function() {
    probabilityArray = [];

    // Tìm giá trị xác suất nhỏ nhất trong mảng segmentValuesArray
    var minProbability = Infinity;
    segmentValuesArray.forEach(function(el) {
        var probability = parseFloat(el.probability);
        if (probability < minProbability) {
            minProbability = probability;
        }
    });

    // Lặp qua mỗi phần tử trong mảng segmentValuesArray và thêm vào probabilityArray dựa trên giá trị xác suất
    segmentValuesArray.forEach(function(el) {
        var probability = parseFloat(el.probability);
        var repetitions = Math.round(probability / minProbability); // Số lần lặp lại (sau khi làm tròn)
        for (var i = 0; i < repetitions; i++) {
            probabilityArray.push(el.value);
        }
    });
};
   // lấy một giá trị quay ngẫu nhiên cho việc nhấp để quay
    getRandomClickSpin = function() {
      var val = - (rotationStep * randomBetween(0, numSegments)) - numRevsPerDestination * spinMultiplier
      return val
    },
    //lấy giá trị quay vòng dựa trên xác suất từ một mảng xác suất
    getProbabilityClickSpin = function(){
      var probId = Math.floor(Math.random() * probabilityArray.length);
      var probSeg = probabilityArray[probId];
      var val = - (rotationStep * probSeg) - numRevsPerDestination * spinMultiplier
      
      return val

    },


// hiển thị thông báo lỗi khi tổng xác suất của các phần tử trong mảng segmentValuesArray không bằng 100.
    showProbabilityError = function (){
      var totalProbability = 0;

      // Tính tổng xác suất từ các phần tử trong segmentValuesArray
      segmentValuesArray.forEach(function (el) {
          totalProbability += el.probability;
      });
  
      // Hiển thị thông báo lỗi
      alert("Total probability: " + totalProbability + " - " + probabilityErrorStr);

    },


    // tạo ra chức năng quay bằng cách nhấp chuột vào vòng quay. 
    createClickToSpin = function(){
 //xác suất được thiết lập cho các phần tử. Nếu có, hàm createProbabilityArray sẽ được gọi để tạo một mảng xác suất.
      if(checkHasProbability()){

        createProbabilityArray();
      }
      //check to see if the author called setSpinTrigger before init();
      //if spinTrigger is defined then they set it before
      //if it's not then we set wheel to be the button. Later the author may
      //overwrite this with their own button
      if(spinButton){
        spinButton.onclick = getTrigger();
      } else {
        spinButton = wheel;
        wheel.onclick = getTrigger();        
      } 

    
      },
      // Nếu có xác suất, sử dụng hàm quay dựa trên xác suất , nếu xác xuất không có
    getTrigger = function(){
         return function(){

          if(hasProbability){

          ThrowPropsPlugin.to(wheel, {
            throwProps:{
              rotation:{
                velocity:randomBetween(-700, -500), 
                //if it's random spins then get a random spin but pass in the multiplier to ensure a long spin (plus the right slot id)
                //if it has destinations set then use those
                end:getProbabilityClickSpin()
                //end:dest
              }
            },
            onStart:onButtonPress,
            onUpdate:throwUpdate,
            ease: Back.easeOut.config(0.2),
            overshootTolerance:0,
            onComplete:spinComplete
          });  
            
          } else {
            
         var dest = -rotationStep * 2;
         
          ThrowPropsPlugin.to(wheel, {
            throwProps:{
              rotation:{
                velocity:randomBetween(-700, -500), 
                //if it's random spins then get a random spin but pass in the multiplier to ensure a long spin (plus the right slot id)
                //if it has destinations set then use those
                end:(randomSpins) ? getRandomClickSpin(): [spinDestinationArray[spinCount]]
                //end:dest
              }
            },
            onStart:onButtonPress,
            onUpdate:throwUpdate,
            ease: Back.easeOut.config(0.2),
            overshootTolerance:0,
            onComplete:spinComplete
            }); 
            
          //  var val = getProbabilityClickSpin();
           // console.log("Returned value from getProbabilityClickSpin:", val);
            
          //  createProbabilityArray(); // Gọi hàm createProbabilityArray để tạo mảng probabilityArray
         //  console.log(probabilityArray); // In ra mảng probabilityArray
          
       // console.log(segmentValuesArray);

          //alert('Không có xác suất được cung cấp.');

          }         
        }      
    },
     // xử lý sự kiện khi vòng quay kết thúc. 
    spinComplete = function() {

      //work out where the wheel lands
      currentWheelRoation = wheel._gsTransform.rotation;
      var normalizedRotation = Math.round(currentWheelRoation % 360);
      normalizedRotation = (normalizedRotation > 0) ? 360 - normalizedRotation : normalizedRotation;

      normalizedRotation = (normalizedRotation < 0) ? normalizedRotation *= -1 : normalizedRotation;        
      
      var segId = Math.round(normalizedRotation / rotationStep);
      var winningSegment = segmentArray[segId].path;

      showResult(Math.abs(segId));
      
      //randomSpins is true if no destinations have been set
      if (randomSpins) {
        //this means no destinations have been set        
        if (numSpins > -1) {
          //this means no destinations have been set AND numSpins has been set to a positive number          
          spinCount++;
          
        } else {
          //this means no destinations have been set AND numSpins is -1 meaning you can spin randomly forever
          //so stop executing anything else
          return;
        }
      } else {
        //this means destinations have been set
        spinCount++;

      }

      if (spinCount >= numSpins) {
        endGame();
        return;
      }
      
      spinButton.onclick = getTrigger();
    },    
    
    //sử dụng để kết thúc trò chơi khi số lần quay đã đạt đến giới hạn 
    endGame = function() {

      //prevent the wheel being dragged once the game has finished
      disableWheel();

      TweenMax.set(wheelSVG, {
        alpha: 1
      })

      //show the gameOver text after 4 seconds
      TweenMax.to(toastText, 1, {
        text: gameOverText,
        ease: Linear.easeNone,
        delay: 2
      })

      onGameEnd({gameId:gameId, target:thisWheel, results:gameResultsArray});

    },

        // vô hiệu hóa khả năng quay vòng tròn
    disableWheel = function() {
      if(clickToSpin)return;
      wheelDragger[0].disable();
    },
     //kích hoạt khả năng quay vòng quay. 
    enableWheel = function() {
      if(clickToSpin)return;
      wheelDragger[0].enable();
    },

        // sử dụng để hiển thị kết quả của vòng quay
    showResult = function(e) {
      
      updateWheelBounds();
      
      var resultObj;
      //if it's an error 
      if (e == "invalidSpin") {

        TweenMax.set(wheel, {
            rotation: spinDestinationArray[spinCount]
          })
        showToast(invalidSpinText);
        //create a result object 
        resultObj = {target:thisWheel, type:'error', spinCount:spinCount, win:null, msg:invalidSpinText, gameId:gameId};

        //fire the error event
        onError(resultObj);
        
        //add result to gameResultsArray
        gameResultsArray.push(resultObj);
                   
        return;
      }
      //if it's a number then it's a segment
      if (!isNaN(e)) {
        //the JSON contains a property that defines whether the segment is a winner or loser. Useful for backend decisions.
        //var resultStr1 = (segmentValuesArray[e].win) ? 'WIN:' : 'LOSE:';
        var resultStr2 = segmentValuesArray[e].resultText;

        showToast(resultStr2);
        //create a result object 
        resultObj = {target:thisWheel, type:'result', spinCount:spinCount, win:segmentValuesArray[e].win, msg:segmentValuesArray[e].resultText, gameId:gameId, userData:segmentValuesArray[e].userData};
        
        //fire the result event
        onResult(resultObj);
        
        //add result to gameResultsArray
        gameResultsArray.push(resultObj);
      }
    },
     //hiển thị văn bản giới thiệu trước khi bắt đầu vòng quay.
    showIntroText = function(str) {
      showToast(introText);
    },
    // hiển thị thông báo lỗi khi khởi tạo vòng quay gặp vấn đề.
  showInitError = function(str) {
      TweenMax.set([wheelSVG, peg], {
        visibility: 'hidden'
      }) 
      alert(str);     
      //showToast(str);
    },
    //hiển thị một thông báo ngắn (toast) trên giao diện người dùng.
    showToast = function(str) {
      toast.style.visibility = 'visible';
      toast.style.backgroundColor = '#E81D62';
      toastText.innerHTML = str;
      TweenMax.fromTo(toast, 0.6, {
        y: 20,
        alpha: 0
      }, {
        y: 0,
        alpha: 1,
        delay: 0.2,
        onStart:onresize,
        ease: Elastic.easeOut.config(0.7, 0.7)
      })
      
    },
        // kiểm tra số lượng segment của vòng quay
    checkNumSegments = function() {

      if (numSegments <= 1) {
        showInitError(initError2)
        TweenMax.set(wheelSVG, {
          visibility: 'hidden'
        })
        toast.style.backgroundColor = 'red';
      }
      

    },
    //gắn kết sự kiện quay vòng vào nút bấm hoặc vòng quay chính nếu chế độ "click to spin" được kích hoạt.
    setSpinTrigger = function(){  
      
      if(spinButton){
        clickToSpin = true;
      }
      if(clickToSpin){
        
        if(spinButton){
          spinButton.onclick = getTrigger(); 
        } else {
          
          wheel.onclick = getTrigger(); 
        }               
      } else {
        
      }
  },
  //xử lý kết quả sau khi vòng quay hoàn thành một chu kỳ quay. 
    onResult = function(e){
        thisWheel.onResult(e)
      },
        // xử lý khi có lỗi xảy ra trong quá trình quay vòng.
   onError = function(e){
        thisWheel.onError(e)
      },
      //để xử lý khi trò chơi kết thúc. Đối số e là một đối tượng chứa thông tin về kết thúc trò chơi, 
   onGameEnd = function(e){
        thisWheel.onGameEnd(e)
      }
 
 
  this.onResult = onResult;
  this.onError = onError;
  this.onGameEnd = onGameEnd;
 
 
  this.getGameProgress = function(){  return gameResultsArray; };
  //Sau khi thiết lập dữ liệu khởi tạo, vị trí khởi đầu, và vẽ các đoạn, trò chơi sẽ được khởi tạo với việc kiểm tra số lượng đoạn.
  this.init = function(e) {
    
    if(!e){
      setInitPos();
      showInitError('PLEASE INCLUDE THE INIT OBJECT');
      return;
    }
    svgWidth = e.data.svgWidth;
    svgHeight =  e.data.svgHeight;
    wheelSVG.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + e.data.svgHeight);
    dataObj = e.data;
    onGameEnd = (e.onGameEnd) ? e.onGameEnd : function(){};
    onResult =  (e.onResult) ? e.onResult : function(){};
    onError = (e.onError) ? e.onError : function(){};
    spinButton = (e.spinTrigger) ? e.spinTrigger : null;
    setSpinTrigger();
    setInitData();
    setInitPos();
    drawSegments();
    wheelOutline.appendChild(getWheel())
    centerCircle.appendChild(getCenterCircle());
    setSpinDestinations();
    checkNumSegments();

    
    
    
  } 

  //sự kiện kích thước trình duyệt thay đổi
window.onresize = function(){

    //console.log(parseFloat(getComputedStyle(wheelSVG).height));
    var centerDiffY =centerY - (svgHeight/2)
    var w = parseFloat(getComputedStyle(wheelSVG).width);
    var h = parseFloat(getComputedStyle(wheelSVG).height);
    var toastWidth = parseFloat(getComputedStyle(toast).width);
    var toastHeight = parseFloat(getComputedStyle(toast).height);
    TweenMax.set('.toast', {
      //x:(w/2) - (toastWidth/2),
      y:((h+ centerDiffY)/2) - (toastHeight/2) 
    })

    //console.log(centerY, centerDiffY)
  }
//hởi động lại trò chơi sau khi đã kết thúc hoặc cần khởi động lại
  this.restart = function() {
    if(!clickToSpin){
        wheelDragger[0].kill();
        currentWheelPos = oldWheelPos = null;
        TweenMax.to([wheel, valueContainer], 0.3, {
          rotation: '0_short',
          onComplete: createDraggable
        })      
    }
      
       TweenMax.set(wheelSVG, {
          alpha: 1
        })
        TweenMax.to([wheel, valueContainer], 0.3, {
          rotation: '0_short'
        })      

      toast.style.visibility = 'hidden';
      spinCount = 0;
      spinMultiplier = 2;
      gameResultsArray = [];


     // showIntroText();
  }
  
  //ngăn chặn bất kỳ thông báo hoặc lỗi nào được hiển thị trong console 
/*  window.console.log = function(){
    console.error('Sorry , developers tools are blocked here....');
    window.console.log = function() {
        return false;
    }
  }*/

    
}

