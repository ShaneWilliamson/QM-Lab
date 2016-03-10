package test;

import java.util.Arrays;
import java.util.Collection;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

import static org.junit.Assert.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.chrome.ChromeDriver;

@RunWith(Parameterized.class)
public class SmokeTest {
  private String baseUrl;
  private StringBuffer verificationErrors = new StringBuffer();
  private WebDriverWait wait;  
  // After every run the browser will switch to a new one
  // and be placed into the driver to use
  private WebDriver browser;
  private WebDriver driver;

  /**
   * Constructor class for the smoke test
   * @param browser - The new browser 
   */
  public SmokeTest(WebDriver browser){
    assert browser != null;
    this.browser = browser;
  }

   @Parameters
   /**
    * This is a method that gets all the browsers we are going to use for testing 
    * @return An array containing all the webDrivers to test
    */
   public static Collection<Object[] > data(){
    if(OSValidator.isMac())
      System.setProperty("webdriver.chrome.driver", "src/test/resources/selenium_standalone_binaries/osx/googlechrome/64bit/chromedriver");
    else if(OSValidator.isUnix())
      System.setProperty("webdriver.chrome.driver", "src/test/resources/selenium_standalone_binaries/linux/googlechrome/64bit/chromedriver");
    //TODO add windows

    Object[][] data = new Object[][] { { new ChromeDriver() }, { new FirefoxDriver() }};
    assert data != null;
    return Arrays.asList(data);
  }

  
  @Before
  public void setUp() throws Exception {
    driver = browser;
    baseUrl = "http://cmpt371g3.usask.ca/";
  }

  @Test
  public void AuthTest() throws Exception {
    // Note: Thread.sleep is to let things load. Measured in milliseconds.
    // Get the web page and go to it
    wait = new WebDriverWait(driver, 10);
    driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
    driver.get(baseUrl + "/demo/development/src/Main/");
    final String previousURL = driver.getCurrentUrl();
    
    Thread.sleep(2500);
    // Store the current window handle
    String winHandleBefore = driver.getWindowHandle();

    // Perform the click operation that opens new window
    driver.findElement(By.xpath("//button[contains(text(),'Authorize')]")).click();
    
    // Switch to new window opened
    for(String winHandle : driver.getWindowHandles()){
        driver.switchTo().window(winHandle);
    }
    // Wait two seconds for the authentication window and then enter email
    Thread.sleep(2000);
    Thread.sleep(500);
    driver.findElement(By.id("Email")).clear();
    driver.findElement(By.id("Email")).sendKeys("cmpt371testingemail");
    
    // Wait 0.5 seconds and then press next
    Thread.sleep(500);
    driver.findElement(By.id("next")).click();
    
    // Wait 2.5 seconds for the next page and then send the password
    Thread.sleep(2500);
    driver.findElement(By.id("Passwd")).clear();
    driver.findElement(By.id("Passwd")).sendKeys("DarthVader!");
    
    // Wait 1.5 seconds and then press sign in
    Thread.sleep(1500);
    driver.findElement(By.id("signIn")).click();
    
    // Go back to the previous window
    driver.switchTo().window(winHandleBefore);
    
    // Wait two seconds for the page to load 
    Thread.sleep(2000);
    
    // Assert that the URL has changed and moved to the new page
    ExpectedCondition<Boolean> e = new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver d) {
        assert d.getCurrentUrl() != null;
        return (d.getCurrentUrl() != previousURL);
      }
    };
    wait.until(e);
    
    // Create new items, then check that they were actually created.
    // TODO Turn into function
    driver.findElement(By.xpath("//div[contains(text(),'Stock')]")).click();
    driver.findElement(By.id("paperView")).click();
    assertTrue(isElementPresent(By.cssSelector(".Stock")));
    
    driver.findElement(By.xpath("//div[contains(text(),'Image')]")).click();
    driver.findElement(By.id("paperView")).click();
    assertTrue(isElementPresent(By.cssSelector(".ImageNode")));
    
    driver.findElement(By.xpath("//div[contains(text(),'Variable')]")).click();
    driver.findElement(By.id("paperView")).click();
    assertTrue(isElementPresent(By.cssSelector(".Variable")));
    
    driver.findElement(By.xpath("//div[contains(text(),'Parameter')]")).click();
    driver.findElement(By.id("paperView")).click();
    assertTrue(isElementPresent(By.cssSelector(".Parameter")));
    
    // Switch to Links tab, and wait for it to finish switching.
    driver.findElement(By.xpath("//div[contains(text(),'Links')]")).click();
    for (int second = 0;; second++) {
        if (second >= 60) fail("timeout");
        try { if ("Flow".equals(driver.findElement(By.cssSelector("div.webix_list_item")).getText())) break; } catch (Exception e2) {}
        Thread.sleep(1000);
    }

    // All the links are of the same class, so count the number of links to make sure a new one is being
    // created each time.
    int numLinks;
    
    driver.findElement(By.xpath("//div[contains(text(),'Flow')]")).click();
    driver.findElement(By.id("paperView")).click();
    numLinks = driver.findElements(By.className("localLink")).size();
    assertTrue(numLinks == 1);
    
    driver.findElement(By.xpath("//div[contains(text(),'Simple Straight')]")).click();
    driver.findElement(By.id("paperView")).click();
    numLinks = driver.findElements(By.className("localLink")).size();
    assertTrue(numLinks == 2);
    
    driver.findElement(By.xpath("//div[contains(text(),'Simple Curved')]")).click();
    driver.findElement(By.id("paperView")).click();
    numLinks = driver.findElements(By.className("localLink")).size();
    assertTrue(numLinks == 3);
    
    // TODO Test if a file is made in google drive. 
    // Click the file, then delete the file
  }
  
  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }


  @After
  public void tearDown() throws Exception {
    // Close when done. We will move this to a newer spot with more tests
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

}
