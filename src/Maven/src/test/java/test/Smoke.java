package test;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Smoke{
	private String baseUrl, nodeUrl;
	private StringBuffer verificationErrors = new StringBuffer();
	private WebDriverWait wait;  
	private WebDriver driver;
	
	@Before
	public void setUp() throws Exception {
		baseUrl = "http://cmpt371g3.usask.ca/";
		nodeUrl = "http://localhost:4444/wd/hub";
	}
	
	@Test
	public void FirefoxTest() throws Exception {
		verificationErrors.append("Firefox:\n");
		
		// Set up to test with Firefox.
		DesiredCapabilities capability = DesiredCapabilities.firefox();
		capability.setBrowserName("firefox");
		
		driver = new RemoteWebDriver(new URL(nodeUrl), capability);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

		Test();
	}
	
	@Test
	public void ChromeTest() throws Exception {
		verificationErrors.append("Chrome:\n");
		
		//Set up to test with Chrome.
		DesiredCapabilities capability = DesiredCapabilities.chrome();
		capability.setBrowserName("chrome");
		driver = new RemoteWebDriver(new URL(nodeUrl), capability);
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

		Test();
	}

	public void Test() throws Exception {
		wait = new WebDriverWait(driver, 30);
		System.out.println(driver.toString());
		WebElement element;
		
		// Get the web page and go to it.
		//Thread.sleep(1000);		// Wait for browser to open.
		driver.get(baseUrl + "development/src/Main/");
		final String previousURL = driver.getCurrentUrl();
		
		// Store the current window handle.
		String winHandleBefore = driver.getWindowHandle();

		// Perform the click operation that opens new window.
		click("auth_button");

		// Switch to new window opened.
		for(String winHandle : driver.getWindowHandles()){
			driver.switchTo().window(winHandle);
		}
		
		// Sign into Google.
		// Email and password prompts may be on separate forms.
		if (isElementPresent(By.id("Passwd"))){
			// Email and password are on the same form.
			enterString("Email", "cmpt371testingemail"); // Enter 'cmpt371testingemail' into email field.
			enterString("Passwd", "DarthVader!");
			click("signIn");
		}else{
			// Email and password are on separate forms.
			enterString("Email", "cmpt371testingemail");
			click("next");
			enterString("Passwd", "DarthVader!");
			click("signIn");
		}
		
		// Go back to the previous window.
		driver.switchTo().window(winHandleBefore);

		// Enter filename.
		enterString("docName", "Test File");
		click("docSubmit");

		// Assert that the URL has changed and moved to the new page.
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

		// Create new items.
		// Count number of elements to check that an item was actually created.
		for (int i = 1; i <= 10; i++) {
			// Get the i'th element in the list of nodes.
			elementPath = "//div[contains(@class, 'webix_list')]/div/div[" + i + "]";
			elementName = driver.findElement(By.xpath(elementPath)).getText();

			// Create item by selecting it then clicking on the paperView.
			driver.findElement(By.xpath(elementPath)).click();
			driver.findElement(By.id("paperView")).click();
			try {
				// When an element is created, there are 2 elements with the classname 'element'.
				assertTrue(driver.findElements(By.className("element")).size() == numElements + 2);
			} catch (Error e2) {
				// Element was not created.
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
		numElements = driver.findElements(By.className("link")).size();
		for (int i = 1; i <= 3; i++) {
			elementPath = "//div[@id='objectSelectTabbar']/div/div/div[2]/div/div/div[" + i + "]";
			elementName = driver.findElement(By.xpath(elementPath)).getText();

			driver.findElement(By.xpath(elementPath)).click();
			driver.findElement(By.id("paperView")).click();
			try {
				assertTrue(driver.findElements(By.className("link")).size() == numElements + 2);
			} catch (Error e2) {
				verificationErrors.append(elementName + " was not created.\n");
			}
			numElements = driver.findElements(By.className("link")).size();
		}

		// Check that file was created, then delete it.
		Actions action = new Actions(driver);

		// Go to Google Drive.
		driver.get("http://drive.google.com");
		
		// Check that file was created.
		element = driver.findElement(By.xpath("//span[contains(text(), 'Test File')]"));
		wait.until(ExpectedConditions.elementToBeClickable(element));
		assertTrue(isElementPresent(By.xpath("//span[contains(text(), 'Test File')]")));

		// Right click, then navigate to 'Remove' option.
		//	('Remove' is the 9th option in the context menu)
		action.contextClick(driver.findElement(By.xpath("//*[contains(text(), 'Test File')]")));
		for (int i = 0; i < 9; i++)
			action.sendKeys(Keys.ARROW_DOWN);
		action.sendKeys(Keys.RETURN).build().perform();

		// Wait for file to be deleted.
		Thread.sleep(1000);
		
		verificationErrors.append("Test completed.\n");
	}

	// Check if element exists.
	private boolean isElementPresent(By by) {
		try {
			driver.findElement(by);
			return true;
		} catch (NoSuchElementException e) {
			return false;
		}
	}
	
	// Click the button with id 'id'.
	private void click(String id){
		WebElement element;
		
		element = driver.findElement(By.id(id));
		wait.until(ExpectedConditions.visibilityOf(element));
		element.click();
	}
	
	// Enter 'value' into field with id 'id'.
	private void enterString(String id, String value){
		WebElement element;
		
		element = driver.findElement(By.id(id));
		wait.until(ExpectedConditions.visibilityOf(element));
		element.clear();
		element.sendKeys(value);
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
	
	public synchronized void stop() {
	    //stop the test here
	}
}
