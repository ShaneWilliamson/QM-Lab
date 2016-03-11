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
     driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
     baseUrl = "http://cmpt371g3.usask.ca/";
   }

   @Test
   public void AuthTest() throws Exception {
     // Note: Thread.sleep is to let things load. Measured in milliseconds.
     // Get the web page and go to it
     wait = new WebDriverWait(driver, 10);
     driver.get(baseUrl + "/demo/development/src/Main/");
     final String previousURL = driver.getCurrentUrl();
     Thread.sleep(2000);


     // Store the current window handle
     String winHandleBefore = driver.getWindowHandle();

     // Perform the click operation that opens new window
     driver.findElement(By.id("auth_button")).click();
     
     // Switch to new window opened
     for(String winHandle : driver.getWindowHandles()){
         driver.switchTo().window(winHandle);
     }
     // Wait two seconds for the authentication window and then enter email and password
     Thread.sleep(2000);
     assert "Sign in - Google Accounts" == driver.getTitle();
     Thread.sleep(500);
     driver.findElement(By.id("Email")).clear();
     driver.findElement(By.id("Email")).sendKeys("cmpt371testingemail");
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
     
     int numElements = 0;
     String elementPath;
     String elementName;
     
     // Create new items
     // Count number of elements to check that an item was actually created.
     for (int i = 1; i <= 8; i++) {
         elementPath = "//div[@id='objectSelectTabbar']/div/div/div[2]/div/div/div[" + i + "]";
         elementName = driver.findElement(By.xpath(elementPath)).getText();
                 
         driver.findElement(By.xpath(elementPath)).click();
         driver.findElement(By.id("paperView")).click();
         try {
             assertTrue(driver.findElements(By.className("element")).size() == numElements + 1);
         } catch (Error e2) {
             verificationErrors.append(elementName + " was not created.\n");
         }
         numElements = driver.findElements(By.className("element")).size();
     }
     
     // Switch to Links tab, and wait for it to finish switching.
     driver.findElement(By.xpath("//div[contains(text(),'Links')]")).click();
     for (int second = 0;; second++) {
         if (second >= 60) fail("timeout");
         try { if ("Flow".equals(driver.findElement(By.cssSelector("div.webix_list_item")).getText())) break; } catch (Exception e2) {}
         Thread.sleep(1000);
     }

     // Repeat test for links.
     for (int i = 1; i <= 5; i++) {
         elementPath = "//div[@id='objectSelectTabbar']/div/div/div[2]/div/div/div[" + i + "]";
         elementName = driver.findElement(By.xpath(elementPath)).getText();
                 
         driver.findElement(By.xpath(elementPath)).click();
         driver.findElement(By.id("paperView")).click();
         try {
             assertTrue(driver.findElements(By.className("link")).size() == numElements + 1);
         } catch (Error e2) {
             verificationErrors.append(elementName + " was not created.\n");
         }
         numElements = driver.findElements(By.className("link")).size();
     }
   }
   

   @After
   public void tearDown() throws Exception {
     // Close when done. We will move this to a newer spot with more tests
     driver.quit();
     String verificationErrorString = verificationErrors.toString();
     if (!"".equals(verificationErrorString)) {
       System.out.println(verificationErrorString);
     }
   }
 }
